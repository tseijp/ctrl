'use client'
import {
        DataStreamMessageType,
        LocalP2PRoomMember,
        nowInSec,
        RemoteDataStream,
        RoomPublication,
        SkyWayAuthToken,
        SkyWayContext,
        SkyWayRoom,
        SkyWayStreamFactory,
        uuidV4, // @ts-ignore
} from '@skyway-sdk/room'

export function createToken() {
        return new SkyWayAuthToken({
                jti: uuidV4(),
                iat: nowInSec(),
                exp: nowInSec() + 60 * 60 * 24,
                version: 3,
                scope: {
                        appId: process.env.NEXT_PUBLIC_SKYWAY_APP_ID,
                        rooms: [
                                {
                                        name: '*',
                                        methods: [
                                                'create',
                                                'close',
                                                'updateMetadata',
                                        ],
                                        member: {
                                                name: '*',
                                                methods: [
                                                        'publish',
                                                        'subscribe',
                                                        'updateMetadata',
                                                ],
                                        },
                                },
                        ],
                },
        }).encode(process.env.NEXT_PUBLIC_SKYWAY_SECRET)
}

async function createRoom() {
        const token = createToken()
        const context = await SkyWayContext.Create(token)
        const room = await SkyWayRoom.FindOrCreate(context, {
                type: 'p2p',
                name: 'test',
        })
        return room
}

async function createData(member: LocalP2PRoomMember) {
        const data = await SkyWayStreamFactory.createDataStream()
        await member.publish(data)
        return data
}

export type Callback = (args: DataStreamMessageType) => Promise<void>

function isDataStream(publication: RoomPublication) {
        return publication.contentType === 'data'
}

function isSelfStream(
        publication: RoomPublication,
        member: LocalP2PRoomMember
) {
        return publication.publisher.id === member.id
}

export async function join(callback: Callback) {
        const room = await createRoom()
        const member = await room.join()
        const data = await createData(member)

        room.publications.forEach(async (publication: any) => {
                if (isSelfStream(publication, member)) return
                callback([publication.contentType, publication.id])
                if (!isDataStream(publication)) return
                const { stream } = await member.subscribe<RemoteDataStream>(
                        publication.id
                )
                stream.onData.add(callback)
        })

        room.onStreamPublished.add(async (e: any) => {
                if (isSelfStream(e.publication, member)) return
                callback([e.publication.contentType, e.publication.id])
                if (!isDataStream(e.publication)) return
                const { stream } = await member.subscribe<RemoteDataStream>(
                        e.publication.id
                )
                stream.onData.add(callback)
        })

        return { room, member, data }
}

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

export type Joined = UnwrapPromise<ReturnType<typeof join>>
