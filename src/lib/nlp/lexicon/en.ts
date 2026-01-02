import { Category, AtomicCategory, ComplexCategory } from "../ccg/types";
import { FeatureStructure, Variable } from "../features/types";

// --- Helpers to make definitions concise ---

const atom = (payload: FeatureStructure): AtomicCategory<FeatureStructure> => ({
    kind: "AtomicCategory",
    payload
});

const complex = (
    result: Category<FeatureStructure>,
    direction: "/" | "\\",
    argument: Category<FeatureStructure>
): ComplexCategory<FeatureStructure> => ({
    kind: "ComplexCategory",
    result,
    direction,
    argument
});

const v = (id: string): Variable => ({ kind: "Variable", id });

// --- Lexicon Definition ---

const lexiconData: Record<string, Category<FeatureStructure>[]> = {};
const add = (word: string, cats: Category<FeatureStructure>[]) => {
    lexiconData[word] = cats;
};

// 1. Nouns
add("I", [atom({ type: "NP", case: "nom", num: "sg" })]);
add("them", [atom({ type: "NP", case: "acc", num: "pl" })]);
add("him", [atom({ type: "NP", case: "acc", num: "sg" })]);

// 2. Verbs
// "like": (S\NP[pl])/NP
add("like", [
    complex(
        complex(atom({ type: "S", form: "finite" }), "\\", atom({ type: "NP", case: "nom", num: "pl" })),
        "/",
        atom({ type: "NP", case: "acc" })
    )
]);

// "likes": (S\NP[sg])/NP
add("likes", [
    complex(
        complex(atom({ type: "S", form: "finite" }), "\\", atom({ type: "NP", case: "nom", num: "sg" })),
        "/",
        atom({ type: "NP", case: "acc" })
    )
]);

// 3. Auxiliaries / Modals
// "must": (S\NP_x)/(S[base]\NP_x)
const s_np_x = (form: string) => complex(atom({ type: "S", form }), "\\", atom({ type: "NP", num: v("subj") }));

add("must", [
    complex(s_np_x("finite"), "/", s_np_x("base"))
]);

// "see": (S[base]\NP_y)/NP
add("see", [
    complex(
        complex(atom({ type: "S", form: "base" }), "\\", atom({ type: "NP", case: "nom", num: v("subj_see") })),
        "/",
        atom({ type: "NP", case: "acc" })
    )
]);

export const englishLexicon = lexiconData;