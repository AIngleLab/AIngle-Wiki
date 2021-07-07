import avro from 'avsc';

export default avro.Type.forSchema({
  type: 'record',
  fields: [
    {
      name: 'category',
      type: { type: 'enum', symbols: ['DOG', 'FirstResponder'] }
    },
    {
      name: 'noise',
      type: 'string',
    }
  ]
});
