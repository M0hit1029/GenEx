const Project = require('../models/project.model');

exports.getProjects = (req, res) => {
    // Fetch projects from the database
    res.send({ message: 'List of projects' });
  };
  
  exports.createProject = async(req, res) => {
    const { name, description } = req.body;
    if(!name || !description) {
      console.log('Name and description are required');
      return res.status(400).send({ message: 'Name and description are required' });
      
    }
    userId=req.user_id;
    const project=  await Project.create({
      name,
      description,
      userId
       // Assuming tenantId is available in req.user
    });
    console.log('Project:', project);
    res.send({ message: 'Project created', name ,userId,projectId:project._id});
  };