import { useQuery, UseQueryOptions } from "react-query"
import { api } from "../api"

type User = {
    id: string
    name: string
    email: string
    createdAt: string
}

type GetUsersResponse = {
    totalCount: number
    users: User[]
}

export async function getUsers(page: number): Promise<GetUsersResponse> {
    try {
        const { data, headers } = await api.get('users', {
            params: {
                page
            }
        })

        const totalCount = Number(headers['x-total-count'])

        const users = data.users.map(user => {
            console.log(`Essa é a data ${JSON.stringify(user, null, 2)}`)
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: new Date(user.created_at).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                })
            }
        })


        return {
            users,
            totalCount
        }

    } catch (error) {
        console.error(error)
    }
}

export function useUsers(page: number, options: UseQueryOptions) {
    return useQuery(['users', page], () => getUsers(page), {
        staleTime: 1000 * 60 * 10, // 10 minutes
        ...options
    })
}