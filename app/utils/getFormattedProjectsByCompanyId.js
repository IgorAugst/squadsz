const { Project, Squad } = require('../models');

async function getFormattedProjectsByCompanyId(id) {
  const projects = await Project.getAllByCompanyId(id);
  const squads = await Squad.getAllByCompanyId(id);

  const formattedProjectsByCompanyId = projects.map((project) => {
    const { name: squad } = squads.find(
      ({ id: squadId }) => squadId === Number(project.id_squad),
    ) || {};
    return {
      ...project,
      squad,
    };
  });

  return formattedProjectsByCompanyId;
}

module.exports = getFormattedProjectsByCompanyId;
