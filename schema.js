const joi=require("joi");

module.exports.listingSchema=joi.object({
    listing:joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        price:joi.string().required().min(0),
        location:joi.string().required(),
        country:joi.string().required(),
        image: joi.object({
            filename: joi.string(),
            url: joi.string().uri(),
        }).optional(),
    }).required(),
});

module.exports.ReviewSchema=joi.object({
    Review:joi.object({
       reting:joi.number().required().min(1).max(5),
       comment:joi.string().required(),
    }).required(),
})