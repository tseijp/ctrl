import useCtrl from '@tsei/ctrl/react'
import { useState } from 'react'

export default function Counter() {
        const [count, setCount] = useState(0)
        const { str, num, vec } = useCtrl({ str: '', num: 0, vec: [0, 1, 2] })
        return (
                <>
                        <p className="py-2 text-2xl">{count}</p>
                        <button
                                className="px-4 py-2 bg-orange-400 text-white rounded cursor-pointer"
                                onClick={() => setCount(count + 1)}
                        >
                                Increment
                                {str}
                                {num}
                                {vec}
                        </button>
                </>
        )
}
