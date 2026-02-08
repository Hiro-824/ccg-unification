export const typeDefinition = {
    "exp-list": { parent: "top" },
    "exp-list-empty": { parent: "exp-list" },
    "exp-list-cons": { parent: "exp-list", features: { "FIRST": "expression", "REST": "exp-list" } },

    "pred-list": { parent: "top" },
    "pred-list-empty": { parent: "pred-list" },
    "pred-list-cons": { parent: "pred-list", features: { "FIRST": "predication", "REST": "pred-list" } },

    "per": { parent: "top" },
    "1st": { parent: "per" },
    "2nd": { parent: "per" },
    "3rd": { parent: "per" },

    "num": { parent: "top" },
    "sg": { parent: "num" },
    "pl": { parent: "num" },

    "gend": { parent: "top" },
    "fem": { parent: "gend" },
    "masc": { parent: "gend" },
    "neut": { parent: "gend" },

    "bool": { parent: "top" },
    "+": { parent: "bool" },
    "-": { parent: "bool" },

    "case": { parent: "top" },
    "nom": { parent: "case" },
    "acc": { parent: "case" },

    "syn-cat": { parent: "top", features: { "HEAD": "pos", "VAL": "val-cat" } },
    "val-cat": { parent: "top", features: { "SPR": "exp-list", "COMPS": "exp-list", "MOD": "exp-list" } },
    "sem-cat": { parent: "top", features: { "MODE": "mode", "INDEX": "index", "RESTR": "pred-list" } },

    "expression": { parent: "top", features: { "SYN": "syn-cat", "SEM": "sem-cat", "ARG-ST": "exp-list" } },
    "word": { parent: "expression" },
    "phrase": { parent: "expression" },

    "predication": { parent: "top", features: { "RELN": "reln", "ARG1": "index", "ARG2": "index", "ARG3": "index", } },

    "agr-cat": { parent: "top", features: { "PER": "per", "NUM": "num" } },
    "3sing": { parent: "agr-cat", features: { "PER": "3rd", "NUM": "sg", "GEND": "gend" } },
    "non-3sing": { parent: "agr-cat" },
    "1sing": { parent: "non-3sing", features: { "PER": "1st", "NUM": "sg" } },
    "non-1sing": { parent: "non-3sing" },
    "2sing": { parent: "non-1sing", features: { "PER": "2nd", "NUM": "sg" } },
    "plural": { parent: "non-1sing", features: { "NUM": "pl" } },

    "pos": { parent: "top" },
    "adj": { parent: "pos" },
    "prep": { parent: "pos" },
    "adv": { parent: "pos" },
    "conj": { parent: "pos" },
    "agr-pos": { parent: "pos", features: { "AGR": "agr-cat" } },
    "verb": { parent: "agr-pos", features: { "AUX": "bool" } },
    "noun": { parent: "agr-pos", features: { "CASE": "case" } },
    "det": { parent: "agr-pos", features: { "COUNT": "bool" } },

    "mode": { parent: "top" },
    "prop": { parent: "mode" },
    "ques": { parent: "mode" },
    "dir": { parent: "mode" },
    "ref": { parent: "mode" },
    "ana": { parent: "mode" },
    "none": { parent: "mode" },

    "index": { parent: "top" },

    "reln": { parent: "top" },
    "girl": { parent: "reln" },

    "rule-schema": { parent: "top", features: { "MOTHER": "expression", "HEAD-DTR": "expression", "NON-HEAD-DTR": "expression" } },
};