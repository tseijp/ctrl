type Callback = (args: any) => Promise<void>

export interface Config {
        token?: string
        appId?: string
        secret?: string
        roomName?: string
}

export async function join(SKYWAY: any, callback: Callback, config?: Config) {
        function createToken() {
                return new SKYWAY.SkyWayAuthToken({
                        jti: SKYWAY.uuidV4(),
                        iat: SKYWAY.nowInSec(),
                        exp: SKYWAY.nowInSec() + 60 * 60 * 24,
                        version: 3,
                        scope: {
                                appId: config?.appId!,
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
                }).encode(config?.secret!)
        }

        async function createRoom(token = '') {
                const context = await SKYWAY.SkyWayContext.Create(token)
                const room = await SKYWAY.SkyWayRoom.FindOrCreate(context, {
                        type: 'p2p',
                        name: config?.roomName ?? 'default',
                })
                return room
        }

        async function createData(member: any) {
                const data = await SKYWAY.SkyWayStreamFactory.createDataStream()
                await member.publish(data)
                return data
        }

        function isDataStream(publication: any) {
                return publication.contentType === 'data'
        }

        function isSelfStream(publication: any, member: any) {
                return publication.publisher.id === member.id
        }

        const token = config?.token ?? createToken()
        const room = await createRoom(token)
        const member = await room.join()
        const data = await createData(member)

        room.publications.forEach(async (publication: any) => {
                if (isSelfStream(publication, member)) return
                callback([publication.contentType, publication.id])
                if (!isDataStream(publication)) return
                const { stream } = await member.subscribe(publication.id)
                stream.onData.add(callback)
        })

        room.onStreamPublished.add(async (e: any) => {
                if (isSelfStream(e.publication, member)) return
                callback([e.publication.contentType, e.publication.id])
                if (!isDataStream(e.publication)) return
                const { stream } = await member.subscribe(e.publication.id)
                stream.onData.add(callback)
        })

        return { room, member, data }
}

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

export type Joined = UnwrapPromise<ReturnType<typeof join>>
