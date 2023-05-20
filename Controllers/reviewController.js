import Review from '../Models/reviewModel.js'

export const createReview = async (req, res) => {
    try {
        const {comment, rate, target} = req.body
        let review = await Review.findOne(
            {
                where: {
                    target: target
                }
            }
        )
        if (!review) {
            await Review.create({
                    rate: rate,
                    comment: comment,
                    author: req.session.login,
                    target: target
                }
            )
            return res.status(200).redirect(`/profile/${target}`)
        } else {
            return res.status(409).send("review already exists!")
        }
    } catch (e) {
        console.log(e)
        res.status(400).json({message: 'create review error!'})
    }
}

export const deleteReview = async (req, res) => {
    try {
        const id = req.body
        await Review.destroy({where: {id: id}}).then((review) => {
            console.log('review deleted ' + review)
        })
    } catch (e) {
        console.log(e)
        res.status(400).json({message: 'delete review error!'})
    }
}

export const editReview = async (req, res) => {
    try {
        const {rate, comment} = req.body
        const review = Review.findOne(
            {
                where: {
                    author: req.session.login,
                    target: req.params.id
                }
            }
        )
        if (review) {
            await review.update(
                {
                    rate: rate,
                    comment: comment
                }
            )
                .then(() => console.log('successfully updated review ' + review.id))
            return res.status(200)
        } else return res.status(401).send('review update error!')
    } catch (e) {
        console.log(e)
        res.status(400).json({message: 'edit review error!'})
    }
}