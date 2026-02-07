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
                "MODE": { "type": "mode", "_id": "m" },
                "INDEX": { "type": "index", "_id": "i" },
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
            "SEM": {
                "type": "sem-cat",
                "MODE": "#m",
                "INDEX": "#i",
            },
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
                "MODE": { "type": "mode", "_id": "m" },
                "INDEX": { "type": "index", "_id": "i" },
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
            "SEM": {
                "type": "sem-cat",
                "MODE": "#m",
                "INDEX": "#i",
            }
        }
    },
    "head-modifier": {
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
                        "type": "exp-list-empty",
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
                "MODE": { "type": "mode", "_id": "m" },
                "INDEX": { "type": "index", "_id": "i" },
            }
        },
        "HEAD-DTR": {
            "type": "expression",
            "_id": "7",
            "SYN": {
                "type": "syn-cat",
                "HEAD": "#5",
                "VAL": {
                    "type": "val-cat",
                    "SPR": "#3",
                    "COMPS": {
                        "type": "exp-list-empty",
                    },
                    "MOD": "#4"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "#m",
                "INDEX": "#i",
            }
        },
        "NON-HEAD-DTR": {
            "type": "expression",
            "SYN": {
                "type": "syn-cat",
                "VAL": {
                    "type": "val-cat",
                    "SPR": {
                        "type": "exp-list-empty"
                    },
                    "COMPS": {
                        "type": "exp-list-empty"
                    },
                    "MOD": {
                        "type": "exp-list-cons",
                        "FIRST": "#7",
                        "REST": {
                            "type": "exp-list-empty"
                        }
                    }
                }
            }
        },
    }
}
