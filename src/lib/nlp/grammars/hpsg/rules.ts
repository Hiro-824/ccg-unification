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
                        "type": "exp-list-empty",
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
            "type": "expression",
            "_id": "1",
        },
        "HEAD-DTR": {
            "type": "expression",
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
    },
    "head-complement": {
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
                        "type": "exp-list",
                        "_id": "3",
                    },
                    "COMPS": {
                        "type": "exp-list",
                        "_id": "1"
                    },
                    "MOD": {
                        "type": "exp-list",
                        "_id": "4",
                    },
                }
            },
            "SEM": {
                "type": "sem-cat",
                "_id": "6",
            }
        },
        "NON-HEAD-DTR": {
            "type": "expression",
            "_id": "2",
        },
        "HEAD-DTR": {
            "type": "expression",
            "SYN": {
                "type": "syn-cat",
                "HEAD": "#5",
                "VAL": {
                    "type": "val-cat",
                    "SPR": "#3",
                    "COMPS": {
                        "type": "exp-list-cons",
                        "FIRST": "#2",
                        "REST": "#1",
                    },
                    "MOD": "#4"
                }
            },
            "SEM": "#6"
        }
    }
}
