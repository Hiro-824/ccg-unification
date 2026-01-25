import { FeatureStructureInput } from "../../features/features";

export type LexiconDefinition = Record<string, FeatureStructureInput[]>;

export const lexiconData: LexiconDefinition = {
    "kim": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": { "type": "noun", "AGR": "3sing" },
                "VAL": { "type": "val-cat", "SPR": "exp-list-empty", "COMPS": "exp-list-empty", "MOD": "exp-list-empty" }
            },
            "SEM": { "type": "sem-cat" }
        }
    ],
    "john": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": { "type": "noun", "AGR": "3sing" },
                "VAL": { "type": "val-cat", "SPR": "exp-list-empty", "COMPS": "exp-list-empty", "MOD": "exp-list-empty" }
            },
            "SEM": { "type": "sem-cat" }
        }
    ],
    "mary": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": { "type": "noun", "AGR": "3sing" },
                "VAL": { "type": "val-cat", "SPR": "exp-list-empty", "COMPS": "exp-list-empty", "MOD": "exp-list-empty" }
            },
            "SEM": { "type": "sem-cat" }
        }
    ],
    "girl": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun", "AGR": {
                        "type": "3sing",
                        "_id": "1"
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": {
                        "type": "exp-list-cons",
                        "FIRST": {
                            "type": "expression",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": {
                                    "type": "det",
                                    "AGR": "#1",
                                }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": { "type": "sem-cat" }
        }
    ],
    "telescope": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun", "AGR": {
                        "type": "3sing",
                        "_id": "1"
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": {
                        "type": "exp-list-cons",
                        "FIRST": {
                            "type": "expression",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": {
                                    "type": "det",
                                    "AGR": "#1",
                                }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": { "type": "sem-cat" }
        }
    ],
    "a": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": { "type": "det", "AGR": "3sing", "COUNT": "+" },
                "VAL": { "type": "val-cat", "SPR": "exp-list-empty", "COMPS": "exp-list-empty", "MOD": "exp-list-empty" }
            },
            "SEM": { "type": "sem-cat" }
        }
    ],
    "walks": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": { "type": "verb", "AUX": "-" },
                "VAL": {
                    "type": "val-cat",
                    "SPR": {
                        "type": "exp-list-cons",
                        "FIRST": {
                            "type": "expression",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": { "type": "noun", "CASE": "nom", "AGR": "3sing" }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": { "type": "sem-cat" }
        }
    ],
    "sees": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": { "type": "verb", "AUX": "-" },
                "VAL": {
                    "type": "val-cat",
                    "SPR": {
                        "type": "exp-list-cons",
                        "FIRST": {
                            "type": "expression",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": { "type": "noun", "CASE": "nom", "AGR": "3sing" }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "COMPS": {
                        "type": "exp-list-cons",
                        "FIRST": {
                            "type": "expression",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": { "type": "noun", "CASE": "acc" }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": { "type": "sem-cat" }
        }
    ],
    "with": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": { "type": "prep" },
                "VAL": {
                    "type": "val-cat",
                    "SPR": {
                        "type": "exp-list-empty",
                    },
                    "COMPS": {
                        "type": "exp-list-cons",
                        "FIRST": {
                            "type": "expression",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": { "type": "noun", "CASE": "acc" }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "MOD": {
                        "type": "exp-list-cons",
                        "FIRST": {
                            "type": "expression",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": { "type": "noun" }
                            }
                        },
                        "REST": "exp-list-empty"
                    }
                }
            },
            "SEM": { "type": "sem-cat" }
        },
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": { "type": "prep" },
                "VAL": {
                    "type": "val-cat",
                    "SPR": {
                        "type": "exp-list-empty",
                    },
                    "COMPS": {
                        "type": "exp-list-cons",
                        "FIRST": {
                            "type": "expression",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": { "type": "noun", "CASE": "acc" }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "MOD": {
                        "type": "exp-list-cons",
                        "FIRST": {
                            "type": "expression",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": { "type": "verb" }
                            }
                        },
                        "REST": "exp-list-empty"
                    }
                }
            },
            "SEM": { "type": "sem-cat" }
        }
    ],
};
