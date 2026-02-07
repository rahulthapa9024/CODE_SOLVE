const mongoose = require('mongoose');
const { Schema } = mongoose;

const problemSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true,
    },
    tags: {
        type: [String],
        enum: [
            // Data Structures
            'array',
            'string',
            'linked-list',
            'stack',
            'queue',
            'hash-table',
            'set',
            'heap',
            'binary-tree',
            'bst',
            'trie',
            'graph',
            'segment-tree',
            'fenwick-tree',
            'dsu',

            // Algorithms
            'binary-search',
            'linear-search',
            'merge-sort',
            'quick-sort',
            'heap-sort',
            'counting-sort',
            'radix-sort',
            'dfs',
            'bfs',
            'dijkstra',
            'bellman-ford',
            'floyd-warshall',
            'kruskal-mst',
            'prim-mst',
            'topological-sort',
            'tarjan-scc',
            'kadane',
            'knapsack-dp',
            'lis-dp',
            'matrix-chain-dp',
            'coin-change-dp',
            'edit-distance-dp',
            'activity-selection',
            'huffman-coding',
            'job-scheduling',
            'fractional-knapsack',
            'kmp',
            'rabin-karp',
            'z-algorithm',
            'manacher',

            // Companies only from your Home page companiesData
            'google',
            'amazon',
            'microsoft',
            'apple',
            'facebook',
            'meta',
            'uber',
            'adobe',
            'linkedin',
            'tiktok',
            'paypal',
            'snapchat',
            'netflix',
            'twitter',
            'goldman-sachs',
            'cisco',
            'qualcomm',
            'walmart',
            'flipkart',
            'swiggy',
            'zomato'
        ],
        required: true
    },
    visibleTestCases: [
        {
            input: {
                type: String,
                required: true,
            },
            output: {
                type: String,
                required: true,
            },
            explanation: {
                type: String,
                required: true
            }
        }
    ],
    hiddenTestCases: [
        {
            input: {
                type: String,
                required: true,
            },
            output: {
                type: String,
                required: true,
            }
        }
    ],
    startCode: [
        {
            language: {
                type: String,
                required: true,
            },
            initialCode: {
                type: String,
                required: true
            }
        }
    ],
    referenceSolution: [
        {
            language: {
                type: String,
                required: true,
            },
            completeCode: {
                type: String,
                required: true
            }
        }
    ],
    problemCreator: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
});

const Problem = mongoose.model('problem', problemSchema);

module.exports = Problem;