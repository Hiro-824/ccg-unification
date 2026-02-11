import { FeatureStructureInput } from "../../features/features";

export type LexiconDefinition = Record<string, FeatureStructureInput[]>;

export const lexiconData: LexiconDefinition = {
    "girl": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun", "AGR": {
                        "type": "3sing",
                        "GEND": "fem",
                        "_id": "1"
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": {
                        "type": "exp-list-cons",
                        "FIRST": {
                            "type": "expression",
                            "_id": "arg_spr_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": {
                                    "type": "det",
                                    "AGR": "#1",
                                    "COUNT": "+",
                                }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ref",
                "INDEX": { "type": "index", "_id": "i" },
                "RESTR": { "type": "pred-list-cons", "FIRST": { "type": "predication", "RELN": "girl", "ARG1": "#i" } },
            },
            "ARG-ST": { "type": "exp-list-cons", "FIRST": "#arg_spr_0", "REST": "exp-list-empty" }
        }
    ],
    "girls": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun", "AGR": {
                        "type": "plural",
                        "PER": "3rd",
                        "NUM": "pl",
                        "_id": "1"
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": {
                        "type": "exp-list-cons",
                        "FIRST": {
                            "type": "expression",
                            "_id": "arg_spr_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": {
                                    "type": "det",
                                    "AGR": "#1",
                                    "COUNT": "+",
                                }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ref",
                "INDEX": { "type": "index", "_id": "i" },
                "RESTR": { "type": "pred-list-cons", "FIRST": { "type": "predication", "RELN": "girl", "ARG1": "#i" } },
            },
            "ARG-ST": { "type": "exp-list-cons", "FIRST": "#arg_spr_0", "REST": "exp-list-empty" }
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
                        "GEND": "neut",
                        "_id": "1"
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": {
                        "type": "exp-list-cons",
                        "FIRST": {
                            "type": "expression",
                            "_id": "arg_spr_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": {
                                    "type": "det",
                                    "AGR": "#1",
                                    "COUNT": "+",
                                }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ref",
                "INDEX": { "type": "index", "_id": "i" },
                "RESTR": { "type": "pred-list-cons", "FIRST": { "type": "predication", "RELN": "telescope", "ARG1": "#i" } },
            },
            "ARG-ST": { "type": "exp-list-cons", "FIRST": "#arg_spr_0", "REST": "exp-list-empty" }
        }
    ],
    "telescopes": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun", "AGR": {
                        "type": "plural",
                        "PER": "3rd",
                        "NUM": "pl",
                        "_id": "1"
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": {
                        "type": "exp-list-cons",
                        "FIRST": {
                            "type": "expression",
                            "_id": "arg_spr_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": {
                                    "type": "det",
                                    "AGR": "#1",
                                    "COUNT": "+",
                                }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ref",
                "INDEX": { "type": "index", "_id": "i" },
                "RESTR": { "type": "pred-list-cons", "FIRST": { "type": "predication", "RELN": "telescope", "ARG1": "#i" } },
            },
            "ARG-ST": { "type": "exp-list-cons", "FIRST": "#arg_spr_0", "REST": "exp-list-empty" }
        }
    ],
    "letter": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun", "AGR": {
                        "type": "3sing",
                        "GEND": "neut",
                        "_id": "1"
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": {
                        "type": "exp-list-cons",
                        "FIRST": {
                            "type": "expression",
                            "_id": "arg_spr_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": {
                                    "type": "det",
                                    "AGR": "#1",
                                    "COUNT": "+",
                                }
                            },
                            "SEM": {
                                "type": "sem-cat",
                                "MODE": "none",
                                "INDEX": { "type": "index", "_id": "k" }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ref",
                "INDEX": "#k",
                "RESTR": { "type": "pred-list-cons", "FIRST": { "type": "predication", "RELN": "letter", "ARG1": "#k" }, "REST": "pred-list-empty" },
            },
            "ARG-ST": { "type": "exp-list-cons", "FIRST": "#arg_spr_0", "REST": "exp-list-empty" }
        },
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun", "AGR": {
                        "type": "3sing",
                        "GEND": "neut",
                        "_id": "1"
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": {
                        "type": "exp-list-cons",
                        "FIRST": {
                            "type": "expression",
                            "_id": "arg_spr_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": {
                                    "type": "det",
                                    "AGR": "#1",
                                    "COUNT": "+",
                                }
                            },
                            "SEM": {
                                "type": "sem-cat",
                                "MODE": "none",
                                "INDEX": { "type": "index", "_id": "k" }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "COMPS": {
                        "type": "exp-list-cons",
                        "FIRST": {
                            "type": "phrase",
                            "_id": "arg_comps_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": "prep",
                                "VAL": {
                                    "type": "val-cat",
                                    "SPR": "exp-list-empty",
                                    "COMPS": "exp-list-empty"
                                }
                            },
                            "SEM": {
                                "type": "sem-cat",
                                "INDEX": { "type": "index", "_id": "m" }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ref",
                "INDEX": "#k",
                "RESTR": { "type": "pred-list-cons", "FIRST": { "type": "predication", "RELN": "letter", "ARG1": "#k", "ARG2": "#m" }, "REST": "pred-list-empty" },
            },
            "ARG-ST": {
                "type": "exp-list-cons",
                "FIRST": "#arg_spr_0",
                "REST": { "type": "exp-list-cons", "FIRST": "#arg_comps_0", "REST": "exp-list-empty" }
            }
        },
    ],
    "letters": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun", "AGR": {
                        "type": "plural",
                        "PER": "3rd",
                        "NUM": "pl",
                        "_id": "1"
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": {
                        "type": "exp-list-cons",
                        "FIRST": {
                            "type": "expression",
                            "_id": "arg_spr_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": {
                                    "type": "det",
                                    "AGR": "#1",
                                    "COUNT": "+",
                                }
                            },
                            "SEM": {
                                "type": "sem-cat",
                                "MODE": "none",
                                "INDEX": { "type": "index", "_id": "k" }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ref",
                "INDEX": "#k",
                "RESTR": { "type": "pred-list-cons", "FIRST": { "type": "predication", "RELN": "letter", "ARG1": "#k" }, "REST": "pred-list-empty" },
            },
            "ARG-ST": { "type": "exp-list-cons", "FIRST": "#arg_spr_0", "REST": "exp-list-empty" }
        },
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun", "AGR": {
                        "type": "plural",
                        "PER": "3rd",
                        "NUM": "pl",
                        "_id": "1"
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": {
                        "type": "exp-list-cons",
                        "FIRST": {
                            "type": "expression",
                            "_id": "arg_spr_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": {
                                    "type": "det",
                                    "AGR": "#1",
                                    "COUNT": "+",
                                }
                            },
                            "SEM": {
                                "type": "sem-cat",
                                "MODE": "none",
                                "INDEX": { "type": "index", "_id": "k" }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "COMPS": {
                        "type": "exp-list-cons",
                        "FIRST": {
                            "type": "phrase",
                            "_id": "arg_comps_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": "prep",
                                "VAL": {
                                    "type": "val-cat",
                                    "SPR": "exp-list-empty",
                                    "COMPS": "exp-list-empty"
                                }
                            },
                            "SEM": {
                                "type": "sem-cat",
                                "INDEX": { "type": "index", "_id": "m" }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ref",
                "INDEX": "#k",
                "RESTR": { "type": "pred-list-cons", "FIRST": { "type": "predication", "RELN": "letter", "ARG1": "#k", "ARG2": "#m" }, "REST": "pred-list-empty" },
            },
            "ARG-ST": {
                "type": "exp-list-cons",
                "FIRST": "#arg_spr_0",
                "REST": { "type": "exp-list-cons", "FIRST": "#arg_comps_0", "REST": "exp-list-empty" }
            }
        },
    ],
    "water": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun", "AGR": {
                        "type": "3sing",
                        "GEND": "neut",
                        "_id": "1"
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": {
                        "type": "exp-list-cons",
                        "FIRST": {
                            "type": "expression",
                            "_id": "arg_spr_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": {
                                    "type": "det",
                                    "AGR": "#1",
                                    "COUNT": "-",
                                }
                            },
                            "SEM": {
                                "type": "sem-cat",
                                "MODE": "none",
                                "INDEX": { "type": "index", "_id": "k" }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ref",
                "INDEX": "#k",
                "RESTR": { "type": "pred-list-cons", "FIRST": { "type": "predication", "RELN": "water", "ARG1": "#k" }, "REST": "pred-list-empty" },
            },
            "ARG-ST": { "type": "exp-list-cons", "FIRST": "#arg_spr_0", "REST": "exp-list-empty" }
        },
    ],
    "walk": [
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
                            "_id": "arg_spr_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": { "type": "noun", "CASE": "nom", "AGR": "non-3sing" }
                            },
                            "SEM": {
                                "type": "sem-cat",
                                "INDEX": { "type": "index", "_id": "i" }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "prop",
                "INDEX": { "type": "index" },
                "RESTR": { "type": "pred-list-cons", "FIRST": { "type": "predication", "RELN": "walk", "ARG1": "#i" } },
            },
            "ARG-ST": { "type": "exp-list-cons", "FIRST": "#arg_spr_0", "REST": "exp-list-empty" }
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
                            "_id": "arg_spr_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": { "type": "noun", "CASE": "nom", "AGR": "3sing" }
                            },
                            "SEM": {
                                "type": "sem-cat",
                                "INDEX": { "type": "index", "_id": "i" }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "prop",
                "INDEX": { "type": "index" },
                "RESTR": { "type": "pred-list-cons", "FIRST": { "type": "predication", "RELN": "walk", "ARG1": "#i" } },
            },
            "ARG-ST": { "type": "exp-list-cons", "FIRST": "#arg_spr_0", "REST": "exp-list-empty" }
        }
    ],
    "go": [
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
                            "_id": "arg_spr_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": { "type": "noun", "CASE": "nom", "AGR": "non-3sing" }
                            },
                            "SEM": {
                                "type": "sem-cat",
                                "INDEX": { "type": "index", "_id": "i" }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "COMPS": {
                        "type": "exp-list-cons",
                        "FIRST": {
                            "type": "expression",
                            "_id": "arg_spr_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": { "type": "prep" }
                            },
                            "SEM": {
                                "type": "sem-cat",
                                "INDEX": { "type": "index", "_id": "i" }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "prop",
                "INDEX": { "type": "index" },
                "RESTR": { "type": "pred-list-cons", "FIRST": { "type": "predication", "RELN": "go", "ARG1": "#i" } },
            },
            "ARG-ST": { "type": "exp-list-cons", "FIRST": "#arg_spr_0", "REST": "exp-list-empty" }
        }
    ],
    "goes": [
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
                            "_id": "arg_spr_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": { "type": "noun", "CASE": "nom", "AGR": "3sing" }
                            },
                            "SEM": {
                                "type": "sem-cat",
                                "INDEX": { "type": "index", "_id": "i" }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "COMPS": {
                        "type": "exp-list-cons",
                        "FIRST": {
                            "type": "expression",
                            "_id": "arg_spr_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": { "type": "prep" }
                            },
                            "SEM": {
                                "type": "sem-cat",
                                "INDEX": { "type": "index", "_id": "i" }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "prop",
                "INDEX": { "type": "index" },
                "RESTR": { "type": "pred-list-cons", "FIRST": { "type": "predication", "RELN": "go", "ARG1": "#i" } },
            },
            "ARG-ST": { "type": "exp-list-cons", "FIRST": "#arg_spr_0", "REST": "exp-list-empty" }
        }
    ],
    "see": [
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
                            "_id": "arg_spr_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": { "type": "noun", "CASE": "nom", "AGR": "non-3sing" }
                            },
                            "SEM": {
                                "type": "sem-cat",
                                "INDEX": { "type": "index", "_id": "i" }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "COMPS": {
                        "type": "exp-list-cons",
                        "FIRST": {
                            "type": "expression",
                            "_id": "arg_comps_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": { "type": "noun", "CASE": "acc" }
                            },
                            "SEM": {
                                "type": "sem-cat",
                                "INDEX": { "type": "index", "_id": "j" }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "prop",
                "INDEX": { "type": "index" },
                "RESTR": { "type": "pred-list-cons", "FIRST": { "type": "predication", "RELN": "see", "ARG1": "#i", "ARG2": "#j" } },
            },
            "ARG-ST": {
                "type": "exp-list-cons",
                "FIRST": "#arg_spr_0",
                "REST": { "type": "exp-list-cons", "FIRST": "#arg_comps_0", "REST": "exp-list-empty" }
            }
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
                            "_id": "arg_spr_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": { "type": "noun", "CASE": "nom", "AGR": "3sing" }
                            },
                            "SEM": {
                                "type": "sem-cat",
                                "INDEX": { "type": "index", "_id": "i" }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "COMPS": {
                        "type": "exp-list-cons",
                        "FIRST": {
                            "type": "expression",
                            "_id": "arg_comps_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": { "type": "noun", "CASE": "acc" }
                            },
                            "SEM": {
                                "type": "sem-cat",
                                "INDEX": { "type": "index", "_id": "j" }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "prop",
                "INDEX": { "type": "index" },
                "RESTR": { "type": "pred-list-cons", "FIRST": { "type": "predication", "RELN": "see", "ARG1": "#i", "ARG2": "#j" } },
            },
            "ARG-ST": {
                "type": "exp-list-cons",
                "FIRST": "#arg_spr_0",
                "REST": { "type": "exp-list-cons", "FIRST": "#arg_comps_0", "REST": "exp-list-empty" }
            }
        }
    ],
    "send": [
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
                            "_id": "arg_spr_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": { "type": "noun", "CASE": "nom", "AGR": "non-3sing" }
                            },
                            "SEM": {
                                "type": "sem-cat",
                                "INDEX": { "type": "index", "_id": "i" }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "COMPS": {
                        "type": "exp-list-cons",
                        "FIRST": {
                            "type": "expression",
                            "_id": "arg_comps_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": { "type": "noun", "CASE": "acc" }
                            },
                            "SEM": {
                                "type": "sem-cat",
                                "INDEX": { "type": "index", "_id": "j" }
                            }
                        },
                        "REST": {
                            "type": "exp-list-cons",
                            "FIRST": {
                                "type": "expression",
                                "_id": "arg_comps_1",
                                "SYN": {
                                    "type": "syn-cat",
                                    "HEAD": { "type": "noun", "CASE": "acc" }
                                },
                                "SEM": {
                                    "type": "sem-cat",
                                    "INDEX": { "type": "index", "_id": "k" }
                                }
                            },
                            "REST": "exp-list-empty"
                        }
                    },
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "prop",
                "INDEX": { "type": "index", "_id": "s7" },
                "RESTR": { "type": "pred-list-cons", "FIRST": { "type": "predication", "RELN": "send", "ARG1": "#i", "ARG2": "#j", "ARG3": "#k" } },
            },
            "ARG-ST": {
                "type": "exp-list-cons",
                "FIRST": "#arg_spr_0",
                "REST": {
                    "type": "exp-list-cons",
                    "FIRST": "#arg_comps_0",
                    "REST": { "type": "exp-list-cons", "FIRST": "#arg_comps_1", "REST": "exp-list-empty" }
                }
            }
        },
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
                            "_id": "arg_spr_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": { "type": "noun", "CASE": "nom", "AGR": "non-3sing" }
                            },
                            "SEM": {
                                "type": "sem-cat",
                                "INDEX": { "type": "index", "_id": "i" }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "COMPS": {
                        "type": "exp-list-cons",
                        "FIRST": {
                            "type": "expression",
                            "_id": "arg_comps_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": { "type": "noun", "CASE": "acc" }
                            },
                            "SEM": {
                                "type": "sem-cat",
                                "INDEX": { "type": "index", "_id": "k" }
                            }
                        },
                        "REST": {
                            "type": "exp-list-cons",
                            "FIRST": {
                                "type": "expression",
                                "_id": "arg_comps_1",
                                "SYN": {
                                    "type": "syn-cat",
                                    "HEAD": { "type": "prep" }
                                },
                                "SEM": {
                                    "type": "sem-cat",
                                    "INDEX": { "type": "index", "_id": "j" }
                                }
                            },
                            "REST": "exp-list-empty"
                        }
                    },
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "prop",
                "INDEX": { "type": "index", "_id": "s7" },
                "RESTR": { "type": "pred-list-cons", "FIRST": { "type": "predication", "RELN": "send", "ARG1": "#i", "ARG2": "#j", "ARG3": "#k" } },
            },
            "ARG-ST": {
                "type": "exp-list-cons",
                "FIRST": "#arg_spr_0",
                "REST": {
                    "type": "exp-list-cons",
                    "FIRST": "#arg_comps_0",
                    "REST": { "type": "exp-list-cons", "FIRST": "#arg_comps_1", "REST": "exp-list-empty" }
                }
            }
        }
    ],
    "sends": [
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
                            "_id": "arg_spr_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": { "type": "noun", "CASE": "nom", "AGR": "3sing" }
                            },
                            "SEM": {
                                "type": "sem-cat",
                                "INDEX": { "type": "index", "_id": "i" }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "COMPS": {
                        "type": "exp-list-cons",
                        "FIRST": {
                            "type": "expression",
                            "_id": "arg_comps_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": { "type": "noun", "CASE": "acc" }
                            },
                            "SEM": {
                                "type": "sem-cat",
                                "INDEX": { "type": "index", "_id": "j" }
                            }
                        },
                        "REST": {
                            "type": "exp-list-cons",
                            "FIRST": {
                                "type": "expression",
                                "_id": "arg_comps_1",
                                "SYN": {
                                    "type": "syn-cat",
                                    "HEAD": { "type": "noun", "CASE": "acc" }
                                },
                                "SEM": {
                                    "type": "sem-cat",
                                    "INDEX": { "type": "index", "_id": "k" }
                                }
                            },
                            "REST": "exp-list-empty"
                        }
                    },
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "prop",
                "INDEX": { "type": "index", "_id": "s7" },
                "RESTR": { "type": "pred-list-cons", "FIRST": { "type": "predication", "RELN": "send", "ARG1": "#i", "ARG2": "#j", "ARG3": "#k" } },
            },
            "ARG-ST": {
                "type": "exp-list-cons",
                "FIRST": "#arg_spr_0",
                "REST": {
                    "type": "exp-list-cons",
                    "FIRST": "#arg_comps_0",
                    "REST": { "type": "exp-list-cons", "FIRST": "#arg_comps_1", "REST": "exp-list-empty" }
                }
            }
        },
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
                            "_id": "arg_spr_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": { "type": "noun", "CASE": "nom", "AGR": "3sing" }
                            },
                            "SEM": {
                                "type": "sem-cat",
                                "INDEX": { "type": "index", "_id": "i" }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "COMPS": {
                        "type": "exp-list-cons",
                        "FIRST": {
                            "type": "expression",
                            "_id": "arg_comps_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": { "type": "noun", "CASE": "acc" }
                            },
                            "SEM": {
                                "type": "sem-cat",
                                "INDEX": { "type": "index", "_id": "k" }
                            }
                        },
                        "REST": {
                            "type": "exp-list-cons",
                            "FIRST": {
                                "type": "expression",
                                "_id": "arg_comps_1",
                                "SYN": {
                                    "type": "syn-cat",
                                    "HEAD": { "type": "prep" }
                                },
                                "SEM": {
                                    "type": "sem-cat",
                                    "INDEX": { "type": "index", "_id": "j" }
                                }
                            },
                            "REST": "exp-list-empty"
                        }
                    },
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "prop",
                "INDEX": { "type": "index", "_id": "s7" },
                "RESTR": { "type": "pred-list-cons", "FIRST": { "type": "predication", "RELN": "send", "ARG1": "#i", "ARG2": "#j", "ARG3": "#k" } },
            },
            "ARG-ST": {
                "type": "exp-list-cons",
                "FIRST": "#arg_spr_0",
                "REST": {
                    "type": "exp-list-cons",
                    "FIRST": "#arg_comps_0",
                    "REST": { "type": "exp-list-cons", "FIRST": "#arg_comps_1", "REST": "exp-list-empty" }
                }
            }
        }
    ],
    "kim": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": { "type": "noun", "AGR": "3sing" },
                "VAL": { "type": "val-cat", "SPR": "exp-list-empty", "COMPS": "exp-list-empty", "MOD": "exp-list-empty" }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ref",
                "INDEX": { "type": "index", "_id": "i" },
                "RESTR": { "type": "pred-list-cons", "FIRST": { "type": "predication", "RELN": "named Kim", "ARG1": "#i" } },
            },
            "ARG-ST": "exp-list-empty"
        }
    ],
    "john": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun",
                    "AGR": {
                        "type": "3sing",
                        "GEND": "masc"
                    }
                },
                "VAL": { "type": "val-cat", "SPR": "exp-list-empty", "COMPS": "exp-list-empty", "MOD": "exp-list-empty" }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ref",
                "INDEX": { "type": "index", "_id": "i" },
                "RESTR": { "type": "pred-list-cons", "FIRST": { "type": "predication", "RELN": "named John", "ARG1": "#i" } },
            },
            "ARG-ST": "exp-list-empty"
        }
    ],
    "mary": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun",
                    "AGR": {
                        "type": "3sing",
                        "GEND": "fem"
                    }
                },
                "VAL": { "type": "val-cat", "SPR": "exp-list-empty", "COMPS": "exp-list-empty", "MOD": "exp-list-empty" }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ref",
                "INDEX": { "type": "index", "_id": "i" },
                "RESTR": { "type": "pred-list-cons", "FIRST": { "type": "predication", "RELN": "named Mary", "ARG1": "#i" } },
            },
            "ARG-ST": "exp-list-empty"
        }
    ],
    "i": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun",
                    "CASE": "nom",
                    "AGR": {
                        "type": "1sing",
                        "PER": "1st",
                        "NUM": "sg",
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": "exp-list-empty",
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ref",
                "INDEX": { "type": "index", "_id": "i" },
                "RESTR": {
                    "type": "pred-list-cons",
                    "FIRST": { "type": "predication", "RELN": "speaker", "ARG1": "#i" },
                    "REST": "pred-list-empty"
                },
            },
            "ARG-ST": "exp-list-empty"
        },
    ],
    "me": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun",
                    "CASE": "acc",
                    "AGR": {
                        "type": "1sing",
                        "PER": "1st",
                        "NUM": "sg",
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": "exp-list-empty",
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ref",
                "INDEX": { "type": "index", "_id": "i" },
                "RESTR": {
                    "type": "pred-list-cons",
                    "FIRST": { "type": "predication", "RELN": "speaker", "ARG1": "#i" },
                    "REST": "pred-list-empty"
                },
            },
            "ARG-ST": "exp-list-empty"
        },
    ],
    "you": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun",
                    "CASE": "nom",
                    "AGR": {
                        "type": "agr-cat",
                        "PER": "2nd",
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": "exp-list-empty",
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ref",
                "INDEX": { "type": "index", "_id": "i" },
                "RESTR": {
                    "type": "pred-list-cons",
                    "FIRST": { "type": "predication", "RELN": "addressee", "ARG1": "#i" },
                    "REST": "pred-list-empty"
                },
            },
            "ARG-ST": "exp-list-empty"
        },
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun",
                    "CASE": "acc",
                    "AGR": {
                        "type": "agr-cat",
                        "PER": "2nd",
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": "exp-list-empty",
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ref",
                "INDEX": { "type": "index", "_id": "i" },
                "RESTR": {
                    "type": "pred-list-cons",
                    "FIRST": { "type": "predication", "RELN": "addressee", "ARG1": "#i" },
                    "REST": "pred-list-empty"
                },
            },
            "ARG-ST": "exp-list-empty"
        },
    ],
    "we": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun",
                    "CASE": "nom",
                    "AGR": {
                        "type": "plural",
                        "PER": "1st",
                        "NUM": "pl",
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": "exp-list-empty",
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ref",
                "INDEX": { "type": "index", "_id": "j" },
                "RESTR": {
                    "type": "pred-list-cons",
                    "FIRST": { "type": "predication", "RELN": "group", "ARG1": "#j" },
                    "REST": {
                        "type": "pred-list-cons",
                        "FIRST": { "type": "predication", "RELN": "speaker", "ARG1": { "type": "index", "_id": "l" } },
                        "REST": {
                            "type": "pred-list-cons",
                            "FIRST": { "type": "predication", "RELN": "member", "ARG1": "#j", "ARG2": "#l" },
                            "REST": { "type": "pred-list-empty" }
                        }
                    }
                },
            },
            "ARG-ST": "exp-list-empty"
        },
    ],
    "he": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun",
                    "CASE": "nom",
                    "AGR": {
                        "type": "3sing",
                        "GEND": "masc",
                        "PER": "3rd",
                        "NUM": "sg",
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": "exp-list-empty",
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ref",
                "INDEX": { "type": "index", "_id": "i" },
                "RESTR": {
                    "type": "pred-list-cons",
                    "FIRST": { "type": "predication", "RELN": "male", "ARG1": "#i" },
                    "REST": "pred-list-empty"
                },
            },
            "ARG-ST": "exp-list-empty"
        },
    ],
    "him": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun",
                    "CASE": "acc",
                    "AGR": {
                        "type": "3sing",
                        "GEND": "masc",
                        "PER": "3rd",
                        "NUM": "sg",
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": "exp-list-empty",
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ref",
                "INDEX": { "type": "index", "_id": "i" },
                "RESTR": {
                    "type": "pred-list-cons",
                    "FIRST": { "type": "predication", "RELN": "male", "ARG1": "#i" },
                    "REST": "pred-list-empty"
                },
            },
            "ARG-ST": "exp-list-empty"
        },
    ],
    "her": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun",
                    "CASE": "acc",
                    "AGR": {
                        "type": "3sing",
                        "GEND": "fem",
                        "PER": "3rd",
                        "NUM": "sg",
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": "exp-list-empty",
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ref",
                "INDEX": { "type": "index", "_id": "i" },
                "RESTR": {
                    "type": "pred-list-cons",
                    "FIRST": { "type": "predication", "RELN": "female", "ARG1": "#i" },
                    "REST": "pred-list-empty"
                },
            },
            "ARG-ST": "exp-list-empty"
        },
    ],
    "it": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun",
                    "CASE": "nom",
                    "AGR": {
                        "type": "3sing",
                        "GEND": "neut",
                        "PER": "3rd",
                        "NUM": "sg",
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": "exp-list-empty",
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ref",
                "INDEX": { "type": "index", "_id": "i" },
                "RESTR": {
                    "type": "pred-list-cons",
                    "FIRST": { "type": "predication", "RELN": "thing", "ARG1": "#i" },
                    "REST": "pred-list-empty"
                },
            },
            "ARG-ST": "exp-list-empty"
        },
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun",
                    "CASE": "acc",
                    "AGR": {
                        "type": "3sing",
                        "GEND": "neut",
                        "PER": "3rd",
                        "NUM": "sg",
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": "exp-list-empty",
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ref",
                "INDEX": { "type": "index", "_id": "i" },
                "RESTR": {
                    "type": "pred-list-cons",
                    "FIRST": { "type": "predication", "RELN": "thing", "ARG1": "#i" },
                    "REST": "pred-list-empty"
                },
            },
            "ARG-ST": "exp-list-empty"
        },
    ],
    "she": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun",
                    "CASE": "nom",
                    "AGR": {
                        "type": "3sing",
                        "PER": "3rd",
                        "GEND": "fem",
                        "NUM": "sg",
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": "exp-list-empty",
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ref",
                "INDEX": { "type": "index", "_id": "i" },
                "RESTR": {
                    "type": "pred-list-cons",
                    "FIRST": { "type": "predication", "RELN": "female", "ARG1": "#i" },
                    "REST": "pred-list-empty"
                },
            },
            "ARG-ST": "exp-list-empty"
        },
    ],
    "they": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun",
                    "CASE": "nom",
                    "AGR": {
                        "type": "plural",
                        "PER": "3rd",
                        "NUM": "pl",
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": "exp-list-empty",
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ref",
                "INDEX": { "type": "index", "_id": "i" },
                "RESTR": {
                    "type": "pred-list-cons",
                    "FIRST": { "type": "predication", "RELN": "group", "ARG1": "#i" },
                    "REST": "pred-list-empty"
                },
            },
            "ARG-ST": "exp-list-empty"
        },
    ],
    "them": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun",
                    "CASE": "acc",
                    "AGR": {
                        "type": "plural",
                        "PER": "3rd",
                        "NUM": "pl",
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": "exp-list-empty",
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ref",
                "INDEX": { "type": "index", "_id": "i" },
                "RESTR": {
                    "type": "pred-list-cons",
                    "FIRST": { "type": "predication", "RELN": "group", "ARG1": "#i" },
                    "REST": "pred-list-empty"
                },
            },
            "ARG-ST": "exp-list-empty"
        },
    ],
    "us": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun",
                    "CASE": "acc",
                    "AGR": {
                        "type": "plural",
                        "PER": "1st",
                        "NUM": "pl",
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": "exp-list-empty",
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ref",
                "INDEX": { "type": "index", "_id": "j" },
                "RESTR": {
                    "type": "pred-list-cons",
                    "FIRST": { "type": "predication", "RELN": "group", "ARG1": "#j" },
                    "REST": {
                        "type": "pred-list-cons",
                        "FIRST": { "type": "predication", "RELN": "speaker", "ARG1": { "type": "index", "_id": "l" } },
                        "REST": {
                            "type": "pred-list-cons",
                            "FIRST": { "type": "predication", "RELN": "member", "ARG1": "#j", "ARG2": "#l" },
                            "REST": { "type": "pred-list-empty" }
                        }
                    }
                },
            },
            "ARG-ST": "exp-list-empty"
        },
    ],
    "myself": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun",
                    "AGR": {
                        "type": "1sing",
                        "PER": "1st",
                        "NUM": "sg",
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": "exp-list-empty",
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ana",
                "INDEX": { "type": "index" },
                "RESTR": "pred-list-empty",
            },
            "ARG-ST": "exp-list-empty"
        },
    ],
    "yourself": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun",
                    "AGR": {
                        "type": "agr-cat",
                        "PER": "2nd",
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": "exp-list-empty",
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ana",
                "INDEX": { "type": "index" },
                "RESTR": "pred-list-empty",
            },
            "ARG-ST": "exp-list-empty"
        },
    ],
    "himself": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun",
                    "AGR": {
                        "type": "3sing",
                        "GEND": "masc",
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": "exp-list-empty",
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ana",
                "INDEX": { "type": "index" },
                "RESTR": "pred-list-empty",
            },
            "ARG-ST": "exp-list-empty"
        },
    ],
    "herself": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun",
                    "AGR": {
                        "type": "3sing",
                        "GEND": "fem",
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": "exp-list-empty",
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ana",
                "INDEX": { "type": "index" },
                "RESTR": "pred-list-empty",
            },
            "ARG-ST": "exp-list-empty"
        },
    ],
    "itself": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun",
                    "AGR": {
                        "type": "3sing",
                        "GEND": "neut",
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": "exp-list-empty",
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ana",
                "INDEX": { "type": "index" },
                "RESTR": "pred-list-empty",
            },
            "ARG-ST": "exp-list-empty"
        },
    ],
    "ourselves": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun",
                    "AGR": {
                        "type": "plural",
                        "PER": "1st",
                        "NUM": "pl",
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": "exp-list-empty",
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ana",
                "INDEX": { "type": "index" },
                "RESTR": "pred-list-empty",
            },
            "ARG-ST": "exp-list-empty"
        },
    ],
    "yourselves": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun",
                    "AGR": {
                        "type": "agr-cat",
                        "PER": "2nd",
                        "NUM": "pl",
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": "exp-list-empty",
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ana",
                "INDEX": { "type": "index" },
                "RESTR": "pred-list-empty",
            },
            "ARG-ST": "exp-list-empty"
        },
    ],
    "themselves": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": {
                    "type": "noun",
                    "AGR": {
                        "type": "plural",
                        "PER": "3rd",
                        "NUM": "pl",
                    }
                },
                "VAL": {
                    "type": "val-cat",
                    "SPR": "exp-list-empty",
                    "COMPS": "exp-list-empty",
                    "MOD": "exp-list-empty"
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "ana",
                "INDEX": { "type": "index" },
                "RESTR": "pred-list-empty",
            },
            "ARG-ST": "exp-list-empty"
        },
    ],
    "a": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": { "type": "det", "AGR": "3sing", "COUNT": "+" },
                "VAL": { "type": "val-cat", "SPR": "exp-list-empty", "COMPS": "exp-list-empty", "MOD": "exp-list-empty" }
            },
            "SEM": { "type": "sem-cat", "MODE": "none", "INDEX": { "type": "index", "_id": "i" }, "RESTR": { "type": "pred-list-cons", "FIRST":  { "type": "predication", "RELN": "exists", "ARG1": "#i", }, "REST": "pred-list-empty" } },
            "ARG-ST": "exp-list-empty"
        }
    ],
    "the": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": { "type": "det" },
                "VAL": { "type": "val-cat", "SPR": "exp-list-empty", "COMPS": "exp-list-empty", "MOD": "exp-list-empty" }
            },
            "SEM": { "type": "sem-cat", "MODE": "none", "INDEX": { "type": "index", "_id": "i" }, "RESTR": { "type": "pred-list-cons", "FIRST":  { "type": "predication", "RELN": "the", "ARG1": "#i", }, "REST": "pred-list-empty" } },
            "ARG-ST": "exp-list-empty"
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
                            "_id": "arg_comps_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": { "type": "noun", "CASE": "acc" }
                            },
                            "SEM": {
                                "type": "sem-cat",
                                "INDEX": { "type": "index", "_id": "j" }
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
                            },
                            "SEM": {
                                "type": "sem-cat",
                                "INDEX": { "type": "index", "_id": "i" }
                            }
                        },
                        "REST": "exp-list-empty"
                    }
                }
            },
            "SEM": {
                "type": "sem-cat",
                "MODE": "prop",
                "INDEX": { "type": "index" },
                "RESTR": { "type": "pred-list-cons", "FIRST": { "type": "predication", "RELN": "with", "ARG1": "#i", "ARG2": "#j" } },
            },
            "ARG-ST": { "type": "exp-list-cons", "FIRST": "#arg_comps_0", "REST": "exp-list-empty" }
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
                            "_id": "arg_comps_0",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": { "type": "noun", "CASE": "acc" }
                            },
                            "SEM": {
                                "type": "sem-cat",
                                "INDEX": { "type": "index", "_id": "j" }
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
            "SEM": {
                "type": "sem-cat",
                "MODE": "prop",
                "INDEX": { "type": "index" },
                "RESTR": { "type": "pred-list-cons", "FIRST": { "type": "predication", "RELN": "with", "ARG2": "#j" } },
            },
            "ARG-ST": { "type": "exp-list-cons", "FIRST": "#arg_comps_0", "REST": "exp-list-empty" }
        },
    ],
};
