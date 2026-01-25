import { FeatureStructureInput } from "../../features/features";

export type LexiconDefinition = Record<string, FeatureStructureInput[]>;

export const lexiconData: LexiconDefinition = {
    "kim": [
        {
            "type": "word",
            "SYN": {
                "type": "syn-cat",
                "HEAD": { "type": "noun", "CASE": "nom", "AGR": "3sing" },
                "VAL": { "type": "val-cat", "SPR": "exp-list-empty", "COMPS": "exp-list-empty" }
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
                            "type": "word",
                            "SYN": {
                                "type": "syn-cat",
                                "HEAD": { "type": "noun", "CASE": "nom", "AGR": "3sing" }
                            }
                        },
                        "REST": "exp-list-empty"
                    },
                    "COMPS": "exp-list-empty"
                }
            },
            "SEM": { "type": "sem-cat" }
        }
    ],
};