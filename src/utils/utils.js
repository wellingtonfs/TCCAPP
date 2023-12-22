import Poses from "./poses.js";

export function GetPosesByWord(word) {
    if (! (word in Poses) ) {
        return null;
    } 

    return Poses[word];
}