const { Squad, Employee, Project } = require('../models');

async function getFormattedSquadsByCompanyId(id) {
  const squads = await Squad.findAll({ where: { id_company: id } });
  const employees = await Employee.findAll({ where: { id_company: id } });
  const projects = await Project.findAll({ where: { id_company: id } });

  const formattedSquadsByCompanyId = Promise.all(squads.map(async (squad) => {
    const lenProjects = projects.filter(
      ({ id_squad: idSquad }) => idSquad === Number(squad.id),
    ).length;
    const { name: manager } = (
      employees.find(({ id: idEmployee }) => idEmployee === Number(squad.id_manager_employee)) || {}
    );
    const employessSquad = await Employee.findAll({ where: { id_squad: squad.id } });
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
