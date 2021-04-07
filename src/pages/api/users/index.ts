import { NextApiRequest, NextApiResponse } from "next";

export default (request: NextApiRequest, response: NextApiResponse) => {
  const users = [
    { id: 1, name: "Thiago" },
    { id: 2, name: "Fernanda" },
    { id: 3, name: "Sogradesse" },
  ];

  return response.json(users);
};

//Serverless
//Subir uma maquina virtual, e executar essa function.
