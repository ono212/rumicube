const main = async () => {
  const { mount } = await import('./src/mount');
  mount();
};

main();
