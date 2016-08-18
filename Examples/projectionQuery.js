let query = {
  filter: (person) => (
    person.age > 17 &&
    person.city === 'Rome'
  ),
  projection: (metadata, proto) => ({
    include: ["id", "birth", "age"]
  })
};
