exports.getRequirements = (req, res) => {
    // Fetch requirements from the database
    res.send({ message: 'List of requirements' });
  };
  
  exports.addRequirement = (req, res) => {
    const { text } = req.body;
    // Add logic to save a new requirement
    res.send({ message: 'Requirement added', text });
  };