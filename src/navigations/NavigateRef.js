import { createRef } from "react";
import { CommonActions } from "@react-navigation/native";

export const navigationRef = createRef();

export const navigate = (name, params) => {
    navigationRef?.current?.navigate(name, params);
};
export const goBack = () => navigationRef?.current?.goBack();

export const resetNavigationStack = (name) =>
    navigationRef?.current?.dispatch(
        CommonActions.reset({
            index: 1,
            routes: [{ name: name }],
        })
    );