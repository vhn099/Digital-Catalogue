export const COMMON_VARIABLE = {
    CREATE_USER_FUNCTION: 'https://createusers-xz4kfdxc4a-uc.a.run.app'
};

export const COMMON_FUNCTIONS = {
    isJSONString: (string) => {
        try {
            JSON.parse(string);
        } catch (error) {
            return false;
        }
        return true;
    }
};