import { defineConfig } from '@shad02w/cmz'

// eslint-disable-next-line import/no-default-export -- config file
export default defineConfig({
    commitTypes: [
        {
            name: 'Refactor',
            description: 'A code change that neither fixes a bug nor adds a feature'
        },
        {
            name: 'Fix',
            description: 'A bug fix'
        },
        {
            name: 'Upgrade',
            description: 'Dependencies update and change'
        },

        {
            name: 'Publish',
            description: 'Release new version of extension'
        }
    ],
    scopes: [
        {
            name: '@ycf/legacy',
            description: 'legacy version of the extension'
        },
        {
            name: '@ycf/notifier',
            description: 'Discord bug for reporting changes of youtube chat API'
        },
        {
            name: '@ycf/shared',
            description: 'Shared code of repo'
        },
        {
            name: '@ycf/overlay',
            description: 'React component of chat overlay used in ycf extension'
        },
        {
            name: 'all',
            description: 'Changed of all '
        }
    ],
    resolve: ({ commitType, scope, message }) => `${commitType.name}${scope ? `(${scope.name})` : ''}: ${message} `
})
