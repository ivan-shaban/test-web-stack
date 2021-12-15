import {AmplifyClass} from '@aws-amplify/core/src/Amplify'

declare global {
    interface Window {
        readonly Amplify: AmplifyClass;
    }
}
