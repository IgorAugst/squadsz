const { Squad, Employee, Project } = require('../models');

async function getFormattedSquadsByCompanyId(id) {
  const squads = await Squad.getAllByCompanyId(id);
  const employees = await Employee.getAllByCompanyId(id);
  const projects = await Project.getAllByCompanyId(id);

  const formattedSquadsByCompanyId = Promise.all(squads.map(async (squad) => {
    const lenProjects = projects.filter(
      ({ id_squad: idSquad }) => idSquad === Number(squad.id),
    ).length;
    const { name: manager } = (
      employees.find(({ id: employeeId }) => employeeId === Number(squad.id_manager_employee)) || {}
    );
    const employessSquad = await Employee.getAllBySquadId(squad.id);
    return {
      ...squad,
      manager,
      lenEmployees: employessSquad.length,
      lenProjects,
    };
  }));

  return formattedSquadsByCompanyId;
}

module.exports = getFormattedSquadsByCompanyId;
