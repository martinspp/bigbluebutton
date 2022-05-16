#!/usr/bin/env python3.10

import asyncio
import websockets
import json
import pathlib
import ssl

meetings = {}
wss = {}

async def handler (websocket):
    try:
        async for message in websocket:
            m = json.loads(message)
            meetingId = m['meetingId']
            playerId = m['playerId']
            
            
            if m['id'] == "add":
                isPresenter = m['isPresenter']
                # check if player already exists, if does close the ws
                if meetingId in meetings:
                    if playerId in meetings[meetingId]:
                        print("player " + playerId + " already exists, closing")
                        websocket.close()

                # if new meeting, create record
                if meetingId not in meetings:
                    meetings[meetingId] = {}
                    #0th seat is Presenter
                    meetings[meetingId]["seatings"] = [None,None,None,None,None,None,None,None,None]

                # record this connection to broadcast later
                if meetingId not in wss:
                    wss[meetingId] = []
                wss[meetingId].append(websocket)

                
                if isPresenter:
                    if meetings[meetingId]['seatings'][0] != None:
                    # Need to move existing presenter
                        emptySeatIdx = findEmptySeat(meetings[meetingId]["seatings"])
                        if emptySeatIdx == -1:
                            # No free seat found, replacing existing user, no seat for player will be handled by the engine
                            meetings[meetingId]["seatings"][0] = playerId;
                        else:
                            oldPresenter = meetings[meetingId]["seatings"][0]
                            meetings[meetingId]["seatings"][emptySeatIdx] = oldPresenter;
                            meetings[meetingId]["seatings"][0] = playerId;
                    else:
                        meetings[meetingId]["seatings"][0] = playerId;
                else:
                    # place the player in first empty seat
                    emptySeatIdx = findEmptySeat(meetings[meetingId]["seatings"])
                    if emptySeatIdx != -1:
                        meetings[meetingId]["seatings"][emptySeatIdx] = playerId;
                    

                meetings[meetingId][playerId] = {}
                meetings[meetingId][playerId]['wsId'] = str(websocket.id)
                meetings[meetingId][playerId]['playerId'] = playerId
                
                meetings[meetingId][playerId]['LController'] = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
                meetings[meetingId][playerId]['RController'] = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
                meetings[meetingId][playerId]['Head'] = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
                print(websocket)
            if m['id'] == "remove":
                purgePlayer(websocket)
                #websocket.close()
                
                
            if m['id'] == "update":
                LController = m['LController']
                RController = m['RController']
                Head = m['Head']
                meetings[meetingId][playerId]['LController'] = LController
                meetings[meetingId][playerId]['RController'] = RController
                meetings[meetingId][playerId]['Head'] = Head 
            if m['id'] == "updatePresenter":
                isPresenter = m['isPresenter']
                if isPresenter:
                    if meetings[meetingId]['seatings'][0] != None:
                        # Need to move existing presenter
                        emptySeatIdx = findEmptySeat(meetings[meetingId]["seatings"])
                        if emptySeatIdx == -1:
                            # No free seat found, replacing existing user, no seat for player will be handled by the engine
                            meetings[meetingId]["seatings"][0] = playerId;
                        else:
                            oldPresenter = meetings[meetingId]["seatings"][emptySeatIdx]
                            meetings[meetingId]["seatings"][emptySeatIdx] = oldPresenter;
                            meetings[meetingId]["seatings"][0] = playerId;
                    else:
                        meetings[meetingId]["seatings"] = [None if x == playerId else x for x in meetings[meetingId]["seatings"]]
                        meetings[meetingId]["seatings"][0] = playerId;
    finally:
        print("excpetion called")
        purgePlayer(websocket)

def purgePlayer(websocket):
    # because this function is mostly used when the connection is closed unexpectedly, find the meeting and player id by the websocket connection
    meetingId = None
    playerId = None
    for key, value in wss.items():
        if search(value,websocket):
            meetingId = key
    
    for item in meetings[meetingId].items():
        print("asdfasdfasdfasdfasdfasdf############")
        print(item)
        if(item['wsId'] == str(websocket.id)):
            playerId = value['playerId']
            
    if meetingId is not None:
        wss[meetingId].remove(websocket)
        if(not wss[meetingId]):
            wss.pop(meetingId)
    if playerId is not None:
        meetings[meetingId].pop(playerId)
    meetings[meetingId]["seatings"] = [None if x == playerId else x for x in meetings[meetingId]["seatings"]]



def findEmptySeat(seatings):
    for idx, seat in enumerate(seatings):
        # skip presenter seat as we dont want to fill that
        if idx == 0:
            continue
        else:
            if(seat == None):
                return idx
    return -1 # return -1 if all but presenter is filled

def search(list, v):
    for i in range(len(list)):
        if list[i] == v:
            return True
    return False   
                
async def broadcastUpdate():
    for key, value in wss.items():
        websockets.broadcast(value, json.dumps([(v) for k, v in meetings[key].items()]))

async def repeating(timeout, function):
    while True:
        await asyncio.sleep(timeout)
        await function()

async def main():
    ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    bbbssl_cert = pathlib.Path(__file__).with_name("fullchain.pem")
    bbbssl_key = pathlib.Path(__file__).with_name("privkey.pem")
    ssl_context.load_cert_chain(bbbssl_cert, keyfile=bbbssl_key)
    loop = asyncio.get_running_loop()
    stop = loop.create_future()
    loop.create_task(repeating(1,broadcastUpdate))
    
    
    async with websockets.serve(handler, "", 8765, ssl=ssl_context):
        await stop
        
    
asyncio.run(main())
