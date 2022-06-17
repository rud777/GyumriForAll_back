import Users from '../models/Users';

async function main() {
  for (const Model of [
    Users,
  ]) {
    console.log(Model);
    // eslint-disable-next-line no-await-in-loop
    await Model.sync({ alter: true });
  }

  process.exit(0);
}

main().catch(console.error);
