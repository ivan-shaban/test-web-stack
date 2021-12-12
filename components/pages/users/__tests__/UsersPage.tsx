import React from 'react'
import {
    Props,
    UsersPageOriginal,
} from '../UsersPage'
import {User} from 'graphql/generated/type-graphql/models/User'
import {shallow} from 'enzyme'
import {UserCard} from '../components/UserCard/UserCard'
import {Input} from '../../../Input/Input'
import {GET_ALL_USERS_QUERY} from '../../../../lib/apis/graphql'
import {EditUserInfoOverlay} from '../components/EditUserInfoOverlay/EditUserInfoOverlay'
import styles from '../UsersPage.module.scss'

jest.mock('../components/EditUserInfoOverlay/EditUserInfoOverlay', () => ({EditUserInfoOverlay: 'EditUserInfoOverlay'}))
jest.mock('../components/UserCard/UserCard', () => ({UserCard: 'UserCard'}))
jest.mock('../../../Input/Input', () => ({Input: 'Input'}))
jest.mock('../../../Button/Button', () => ({Button: 'Button'}))
jest.mock('../../../Layout/Layout', () => ({Layout: 'Layout'}))

const delay = (ms: number) => {
    return new Promise((resolve) => window.setTimeout(resolve, ms))
}

const useQuery = jest.spyOn(require('@apollo/client'), 'useQuery')
const useRouter = jest.spyOn(require('next/router'), 'useRouter')
const defaultProps: Props = {}
const users: User[] = [
    {
        id: 91,
        name: 'Leanne Grahama',
        // @ts-ignore
        dob: '1990-01-01T00:00:00.000Z',
        address: 'minsk',
        image: 'https://images.unsplash.com/photo-1626038135427-bd4eb8193ba5?ixid=MnwyODEwMzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MzkwNTc3NTc&ixlib=rb-1.2.1&fm=jpg&w=168&h=168&fit=crop',
        description: 'Multi-layered client-server neural-net',
    },
    {
        id: 92,
        name: 'Mrs. Dennis Schulist',
        // @ts-ignore
        dob: '1990-01-01T00:00:00.000Z',
        address: 'South Christy, Norberto Crossing',
        image: 'https://images.unsplash.com/photo-1601455763557-db1bea8a9a5a?ixid=MnwyODEwMzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MzkwNTc3NTc&ixlib=rb-1.2.1&fm=jpg&w=168&h=168&fit=crop',
        description: 'Synchronised bottom-line interface',
    },
]

const createWrapper = (props?: Partial<Props>) => {
    return shallow(<UsersPageOriginal {...defaultProps} {...props}/>)
}
const originalError = console.error

beforeAll(() => {
    const ignoredWarnings = [
        /Warning.*is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements./,
        /Warning: The tag .* is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter./,
        /Warning: React does not recognize the .* prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase .* instead. If you accidentally passed it from a parent component, remove it from the DOM element./,
    ]
    console.error = (...args) => {
        if (ignoredWarnings.some((warningTemplate) => warningTemplate.test(args[0]))) {
            return
        }
        originalError.call(console, ...args)
    }
})

beforeEach(() => {
    useQuery.mockImplementation(() => ({
        data: null,
        fetchMore: jest.fn().mockResolvedValue({}),
    }))
    useRouter.mockImplementation(() => ({
        query: {page: 1},
        push: jest.fn().mockResolvedValue({}),
    }))
})

afterEach(() => {
    useRouter.mockClear()
    useQuery.mockClear()
})

afterAll(() => {
    console.error = originalError
})

it('should handle input change', async function () {
    useQuery.mockImplementation(() => ({
        data: {
            users,
        },
    }))

    const wrapper = createWrapper()

    expect(wrapper.find(UserCard)).toHaveLength(2)

    wrapper.find(Input).simulate('change', {
        currentTarget: {value: 'test'},
    })
    wrapper.update()

    expect(wrapper.find(UserCard)).toHaveLength(0)

    wrapper.find(Input).simulate('change', {
        currentTarget: {value: 'ScHulist'},
    })

    wrapper.update()

    expect(wrapper.find(UserCard)).toHaveLength(1)
})

it('should use predefined page value', function () {
    useRouter.mockReset()
    useRouter.mockImplementation(() => ({
        query: {page: 3},
    }))
    useQuery.mockImplementation(() => ({
        data: {
            users,
        },
    }))

    createWrapper()

    expect(useQuery).toHaveBeenCalledWith(GET_ALL_USERS_QUERY, {
        errorPolicy: 'all',
        notifyOnNetworkStatusChange: true,
        variables: {
            // @ts-ignore
            take: 3 * process.env.NEXT_PUBLIC_USERS_PER_PAGE,
        },
    })
})

it('should use default page value if it exists', function () {
    useQuery.mockImplementation(() => ({
        data: {
            users,
        },
    }))

    createWrapper()

    expect(useQuery).toHaveBeenCalledWith(GET_ALL_USERS_QUERY, {
        errorPolicy: 'all',
        notifyOnNetworkStatusChange: true,
        variables: {
            // @ts-ignore
            take: 1 * process.env.NEXT_PUBLIC_USERS_PER_PAGE,
        },
    })
})

it('should handle card click', async function () {
    useQuery.mockImplementation(() => ({
        data: {
            users,
        },
    }))

    const wrapper = createWrapper()
    expect(wrapper.find(`.${styles.base}`).hasClass(styles.base__withOverlay)).toBeFalsy()
    expect(wrapper.find(EditUserInfoOverlay).exists()).toBeFalsy()

    wrapper.find(UserCard).at(0).prop('onClick')(users[0])
    wrapper.update()

    expect(wrapper.find(`.${styles.base}`).hasClass(styles.base__withOverlay)).toBeTruthy()
    expect(wrapper.find(EditUserInfoOverlay).exists()).toBeTruthy()
})

it('should handle `load more` button click', async function () {
    const push = jest.fn().mockResolvedValue({})
    const fetchMore = jest.fn().mockResolvedValue({})
    useRouter.mockReset()
    useRouter.mockImplementation(() => ({
        query: {page: 3},
        push,
    }))
    useQuery.mockImplementation(() => ({
        data: null,
        fetchMore,
    }))

    const wrapper = createWrapper()
    wrapper.find('#loadMoreButton').simulate('click')

    await delay(100)
    expect(push).toHaveBeenCalledWith({query: {page: '4'}}, undefined, {shallow: true})
    expect(fetchMore).toHaveBeenCalledWith({
        variables: {
            // @ts-ignore
            take: 4 * process.env.NEXT_PUBLIC_USERS_PER_PAGE,
        },
    })
})
