import React from 'react'
import {
    UserCard,
    Props,
} from '../UserCard'
import renderer from 'react-test-renderer'
import {mount} from 'enzyme'

const defaultProps: Props = {
    user: {
        __typename: 'User',
        address: 'address',
        description: 'description',
        id: '0',
        dob: '1990-01-01',
        name: 'name',
        image: 'image',
        createdAt: '2021-12-17T23:01:26.540Z',
        updatedAt: '2021-12-18T13:56:22.311Z',
    },
    onClick: jest.fn(),
}

const createTree = (props?: Partial<Props>) => {
    return renderer.create(<UserCard {...defaultProps} {...props}/>).toJSON()
}

const createWrapper = (props?: Partial<Props>) => {
    return mount(<UserCard {...defaultProps} {...props}/>)
}

describe('snapshots', () => {
    it('default', () => {
        const tree = createTree()
        expect(tree).toMatchSnapshot()
    })

    it('with disabled state', () => {
        const tree = createTree({isDisabled: true})
        expect(tree).toMatchSnapshot()
    })
})

it('should handle onClick', function () {
    const onClick = jest.fn()
    const wrapper = createWrapper({onClick})
    wrapper.simulate('click')

    expect(onClick).toHaveBeenCalledWith(defaultProps.user)
})
