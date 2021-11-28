const Company = require('./Company');
const ORM = require('../orm');

const Project = new ORM('project');
const Squad = new ORM('squad');
const CompanyORM = new ORM('company');
const Employee = new ORM('employee');

module.exports = {
  Company,
  Project,
  Squad,
  CompanyORM,
  Employee,
};
