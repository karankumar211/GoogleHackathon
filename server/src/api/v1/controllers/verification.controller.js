import { verifyLoanLink } from '../services/verification.service.js';
import { ApiError } from '../../../utils/ApiError.js';
import { ApiResponse } from '../../../utils/ApiResponse.js';

const checkLoanLink = async (req, res, next) => {
    try {
        const { url } = req.body;
        if (!url) {
            throw new ApiError(400, "URL is required");
        }

        const result = await verifyLoanLink(url);
        
        return res.status(200).json(new ApiResponse(200, result, "Link verification complete"));
    } catch (error) {
        next(error);
    }
};

export { checkLoanLink };
