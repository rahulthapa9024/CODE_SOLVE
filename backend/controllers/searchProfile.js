const User = require("../models/userSchema")

const searchProfile =  async (req, res) => {

    const { _id } = req.body;

    if (!_id) {
        return res.status(400).json({ 
            success: false, 
            message: 'User ID (_id) is required in the request body.' 
        });
    }

    try {
        const user = await User.findById(_id)
            .select('displayName problemSolved difficultyCount') 
            .populate({
                path: 'problemSolved',
                model: 'Problem'  
            });

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found.' 
            });
        }

        res.status(200).json({
            success: true,
            displayName: user.displayName,
            solvedProblemsCount: user.problemSolved.length,
            difficultyStats: user.difficultyCount,
            solvedProblems: user.problemSolved
        });

    } catch (error) {
        console.error('Error fetching solved problems:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid user ID format.' 
            });
        }
        res.status(500).json({ 
            success: false, 
            message: 'An internal server error occurred.' 
        });
    }
}

module.exports = searchProfile