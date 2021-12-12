import React, {useState as useStateOriginal} from 'react'
import {
    Props,
    UsersPageOriginal,
} from '../UsersPage'
import renderer from 'react-test-renderer'
import {User} from 'graphql/generated/type-graphql/models/User'
import {GET_ALL_USERS_QUERY} from '../../../../lib/apis/graphql'
import {mocked} from 'jest-mock'
import {UserCard} from '../components/UserCard/UserCard'
import {Input} from '../../../Input/Input'

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn(),
}))
jest.mock('../components/EditUserInfoOverlay/EditUserInfoOverlay', () => ({EditUserInfoOverlay: 'EditUserInfoOverlay'}))
jest.mock('../components/UserCard/UserCard', () => ({UserCard: 'UserCard'}))
jest.mock('../../../Input/Input', () => ({Input: 'Input'}))
jest.mock('../../../Button/Button', () => ({Button: 'Button'}))
jest.mock('../../../Layout/Layout', () => ({Layout: 'Layout'}))

const useState = mocked(useStateOriginal as <T>(arg: T) => [T, Function])
const setFilterValue = jest.fn()
const setUserToEdit = jest.fn()
const setHasScroll = jest.fn()
const setLoadingState = jest.fn()
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

const createTree = (props?: Partial<Props>) => {
    return renderer.create(<UsersPageOriginal {...defaultProps} {...props}/>).toJSON()
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
    useState.mockClear()
    setFilterValue.mockClear()
    setUserToEdit.mockClear()
    setHasScroll.mockClear()
    setLoadingState.mockClear()
    useRouter.mockClear()
    useQuery.mockClear()
})

afterAll(() => {
    console.error = originalError
})

it('default', () => {
    useState.mockImplementationOnce((init) => [init, setFilterValue])
    useState.mockImplementationOnce((init) => [init, setUserToEdit])
    useState.mockImplementationOnce((init) => [init, setHasScroll])
    useState.mockImplementationOnce((init) => [init, setLoadingState])

    const tree = createTree()
    expect(tree).toMatchSnapshot()
})

it('should render cards', function () {
    useState.mockImplementationOnce((init) => [init, setFilterValue])
    useState.mockImplementationOnce((init) => [init, setUserToEdit])
    useState.mockImplementationOnce((init) => [init, setHasScroll])
    useState.mockImplementationOnce((init) => [init, setLoadingState])
    useQuery.mockImplementationOnce(() => ({
        data: {
            users,
        },
    }))

    const tree = createTree()
    expect(tree).toMatchSnapshot()
    expect(useQuery).toHaveBeenCalledWith(GET_ALL_USERS_QUERY, {
        errorPolicy: 'all',
        notifyOnNetworkStatusChange: true,
        variables: {
            // @ts-ignore
            take: 1 * process.env.NEXT_PUBLIC_USERS_PER_PAGE,
        },
    })
})

it('should render overlay', function () {
    useState.mockImplementationOnce((init) => [init, setFilterValue])
    useState.mockImplementationOnce((_init) => [users[0], setUserToEdit])
    useState.mockImplementationOnce((init) => [init, setHasScroll])
    useState.mockImplementationOnce((init) => [init, setLoadingState])
    useQuery.mockImplementationOnce(() => ({
        data: {
            users,
        },
    }))

    const tree = createTree()
    expect(tree).toMatchSnapshot()
})

it('should render overlay with scroll', function () {
    useState.mockImplementationOnce((init) => [init, setFilterValue])
    useState.mockImplementationOnce((_init) => [users[0], setUserToEdit])
    useState.mockImplementationOnce((_init) => [true, setHasScroll])
    useState.mockImplementationOnce((init) => [init, setLoadingState])
    useQuery.mockImplementationOnce(() => ({
        data: {
            users,
        },
    }))

    const tree = createTree()
    expect(tree).toMatchSnapshot()
})

it('should render "loading" state', () => {
    useState.mockImplementationOnce((init) => [init, setFilterValue])
    useState.mockImplementationOnce((init) => [init, setUserToEdit])
    useState.mockImplementationOnce((init) => [init, setHasScroll])
    useState.mockImplementationOnce((_init) => [true, setLoadingState])
    useQuery.mockImplementationOnce(() => ({
        data: {
            users,
        },
    }))

    const tree = createTree({isDisabled: true})
    expect(tree).toMatchSnapshot()
})
