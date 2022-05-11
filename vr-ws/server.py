#!/usr/bin/env python3.10

import asyncio
import websockets
import json

meetings = {}
wss = {}

async def handler (websocket):
    try:
        async for message in websocket:
            m = json.loads(message)
            meetingId = m['meetingId']
            playerId = m['playerId']
            if m['id'] == "add":
                if meetingId in meetings:
                    if playerId in meetings[meetingId]:
                        print("player " + playerId + " already exists, closing")
                        websocket.close()
                if meetingId not in meetings:
                    meetings[meetingId] = {}
                if meetingId not in wss:
                    wss[meetingId] = []
                wss[meetingId].append(websocket)
                meetings[meetingId][playerId] = {}
                meetings[meetingId][playerId]['wsId'] = str(websocket.id)
                meetings[meetingId][playerId]['playerId'] = playerId
                meetings[meetingId][playerId]['LController'] = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
                meetings[meetingId][playerId]['RController'] = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
                meetings[meetingId][playerId]['Head'] = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
                print(websocket)
            if m['id'] == "remove":
                websocket.close()
                
            if m['id'] == "update":
                LController = m['LController']
                RController = m['RController']
                Head = m['Head']
                meetings[meetingId][playerId]['LController'] = LController
                meetings[meetingId][playerId]['RController'] = RController
                meetings[meetingId][playerId]['Head'] = Head 
    except (websockets.exceptions.ConnectionClosed, websockets.exceptions.ConnectionClosedError,websockets.exceptions.ConnectionClosedOK ):
        meetingId = None
        playerId = None
        for key, value in wss.items():
            if search(value,websocket):
                meetingId = key
        
        for key,value in meetings[meetingId].items():
            if(value['wsId'] == str(websocket.id)):
                playerId = value['playerId']
                

        print("####")
        if meetingId is not None:
            wss[meetingId].remove(websocket)
            if(not wss[meetingId]):
                wss.pop(meetingId)
        if playerId is not None:
            meetings[meetingId].pop(playerId)


def search(list, v):
    for i in range(len(list)):
        if list[i] == v:
            return True
    return False   
                

async def broadcastUpdate():
    for key, value in wss.items():
        print(f"Broadcasting clients of {key}: {len(value)}")
        websockets.broadcast(value, json.dumps([(v) for k, v in meetings[key].items()]))
        

async def repeating(timeout, function):
    while True:
        await asyncio.sleep(timeout)
        await function()

async def main():
    loop = asyncio.get_running_loop()
    stop = loop.create_future()
    loop.create_task(repeating(0.1,broadcastUpdate))
    
    async with websockets.serve(handler, "", 8765):
        await stop
        
    
asyncio.run(main())
