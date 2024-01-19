import User from '../models/user';


const findUserById = async (userId: any) => {
    const findUser = await User.findById(userId);
    return findUser ? findUser : null;
};


const findByEmail = async (email: string) => {
    const findUser = await User.findOne({ email });
    return findUser ? findUser : null;
};

const add = async (params: any) => {
    let modules = new User(params);
    return await modules.save();
}

export { findUserById, findByEmail, add }