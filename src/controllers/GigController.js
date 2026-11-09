const GigRepository = require('../repositories/GigRepository');

const gigRepository = new GigRepository();

const getActiveGigs = async (req, res, next) => {
    try {
        const gigs = await gigRepository.getAll();

        const activeGigs = gigs
            .filter(gig => gig.status === 'active')
            .map(gig => gig.toPublicJSON());

        return res.status(200).json({
            success: true,
            message: 'Active gigs retrieved successfully.',
            data: activeGigs
        });
    } catch (error) {
        next(error);
    }
};

const getMyGigs = async (req, res, next) => {
    try {
        const gigs = await gigRepository.findByFreelancerId(
            req.user.userId
        );

        return res.status(200).json({
            success: true,
            message: 'Your gigs retrieved successfully.',
            data: gigs.map(gig => gig.toPublicJSON())
        });
    } catch (error) {
        next(error);
    }
};

const getGigById = async (req, res, next) => {
    try {
        const gig = await gigRepository.findById(req.params.id);

        if (!gig || gig.status !== 'active') {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'GIG_NOT_FOUND',
                    message: 'The requested gig could not be found.'
                }
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Gig retrieved successfully.',
            data: gig.toPublicJSON()
        });
    } catch (error) {
        next(error);
    }
};

const createGig = async (req, res, next) => {
    try {
        const gig = await gigRepository.create({
            freelancerId: req.user.userId,
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            deliveryDays: req.body.deliveryDays,
            status: 'active'
        });

        return res.status(201).json({
            success: true,
            message: 'Gig created successfully.',
            data: gig.toPublicJSON()
        });
    } catch (error) {
        next(error);
    }
};

const updateGig = async (req, res, next) => {
    try {
        const existingGig = await gigRepository.findById(req.params.id);

        if (!existingGig) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'GIG_NOT_FOUND',
                    message: 'The requested gig could not be found.'
                }
            });
        }

        if (existingGig.freelancerId !== req.user.userId) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'GIG_ACCESS_DENIED',
                    message: "You cannot modify another freelancer's gig."
                }
            });
        }

        const allowedUpdates = {};

        for (const field of [
            'title',
            'description',
            'category',
            'price',
            'deliveryDays'
        ]) {
            if (req.body[field] !== undefined) {
                allowedUpdates[field] = req.body[field];
            }
        }

        const updatedGig = await gigRepository.update(
            req.params.id,
            allowedUpdates
        );

        return res.status(200).json({
            success: true,
            message: 'Gig updated successfully.',
            data: updatedGig.toPublicJSON()
        });
    } catch (error) {
        next(error);
    }
};

const deleteGig = async (req, res, next) => {
    try {
        const existingGig = await gigRepository.findById(req.params.id);

        if (!existingGig) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'GIG_NOT_FOUND',
                    message: 'The requested gig could not be found.'
                }
            });
        }

        if (existingGig.freelancerId !== req.user.userId) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'GIG_ACCESS_DENIED',
                    message: "You cannot delete another freelancer's gig."
                }
            });
        }

        await gigRepository.delete(req.params.id);

        return res.status(200).json({
            success: true,
            message: 'Gig deleted successfully.'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getActiveGigs,
    getMyGigs,
    getGigById,
    createGig,
    updateGig,
    deleteGig
};