module.exports = {
  service: "http://localhost:5133",
  out: "src/generated/client",
  databaseUrl: "postgresql://electric:electric@localhost:54321/electric?sslmode=disable",
  clientPath: "src/generated/client",
  authMode: "none",
  secret: "9bc0f2cde375b7fe0edb1577beb94aaaef2b92a2aaf1d8383a23e664972965cc",
  
  shapes: [
    {
      name: "lesion",
      table: "lesion"
    },
    {
      name: "option",
      table: "option"
    },
    {
      name: "submission",
      table: "submission"
    }
  ]
};
