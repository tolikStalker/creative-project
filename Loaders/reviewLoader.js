import User from "../Models/reviewModel.js"

export async function getReview(profile, target) {
    if (profile)
        return await User.findOne(
            {
                where:
                    {
                        author: profile,
                        target: target
                    }
            }
        ).catch(e => console.log(e))
    return undefined
}

export async function getAllReview(profile) {
    return await User.findAll(
        {
            where:
                {
                    target: profile
                }
        }
    )
}