const Problem = require("../models/problem");

const getSpecificTagProblem = async (req, res) => {
    try {
      let tags = req.params.tag; // <-- use params here
  
      if (!tags) {
        return res.status(400).send("Tag(s) param is required");
      }
  
      if (typeof tags === "string") {
        tags = tags.split(",").map(t => t.trim());
      }
  
      const problems = await Problem.find({ tags: { $in: tags } }).select("_id title difficulty tags");
  
      if (!problems.length) return res.status(404).send("No problems found for the given tag(s)");
  
      return res.status(200).json(problems);
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error: " + (error.message || error));
    }
  };
  
  
  

module.exports = getSpecificTagProblem;
