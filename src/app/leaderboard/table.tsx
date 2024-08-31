"use client";

import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";

import Loader from "../../components/loading";
import { useEffect, useState } from "react";
import { getUsers } from "./page";
import { User } from "../api/users/route";

const columns: GridColDef[] = [
  {
    field: "image",
    headerName: "Image",
    width: 100,
    renderCell: (params: GridRenderCellParams<any, Date>) => (
      <Avatar
        src={params.row?.image || "/images/default.png"}
        alt="Profile image"
      />
    ),
  },
  { field: "name", headerName: "Name", width: 400 },
  { field: "email", headerName: "Email", width: 400 },
  { field: "score", headerName: "Score", width: 100 },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function Table() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getLeaderBoard = async () => {
    setLoading(true);

    const usersRes = await getUsers();
    setUsers(usersRes);

    setLoading(false);
  };

  useEffect(() => {
    getLeaderBoard();
  }, []);

  return (
    <>
      <Loader loading={loading} />
      <Paper sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          initialState={{
            pagination: { paginationModel },
            sorting: {
              sortModel: [{ field: "score", sort: "desc" }],
            },
          }}
          pageSizeOptions={[5, 10]}
          sx={{ border: 50 }}
        />
      </Paper>
    </>
  );
}
