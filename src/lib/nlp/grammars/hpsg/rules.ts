import { FeatureStructureInput } from "../../features/features";

export type RuleDefinition = Record<string, FeatureStructureInput>;

export const ruleData: RuleDefinition = {
    "head-specifier": {
        "type": "rule-schema",
        "MOTHER": {
            "type": "phrase",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "pos",
                    "_id": "5"
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": {
                        "type": "exp-list-empty"
                    },
                    "COMPS": {
                        "type": "exp-list",
                        "_id": "2",
                    },
                    "MOD": {
                        "type": "exp-list",
                        "_id": "3",
                    },
                }
            },
            "SEM": {
                "type": "sem-cat",
                "_id": "4",
            }
        },
        "NON-HEAD-DTR": {
            "type": "word",
            "_id": "1",
        },
        "HEAD-DTR": {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": "#5",
                "VAL": {
                    "type": "val-cat",
                    "SPR": {
                        "type": "exp-list-cons",
                        "FIRST": "#1"
                    },
                    "COMPS": "#2",
                    "MOD": "#3",
                }
            },
            "SEM": "#4",
        }
    }
}