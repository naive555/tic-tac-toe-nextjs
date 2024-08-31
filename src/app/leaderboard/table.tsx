"use client";

import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";

type Users = {
  id: number;
  email: string;
  name: string;
  image: string;
  score: number;
  streak: number;
  created_at: Date;
  updated_at: Date;
};

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
  { field: "name", headerName: "Name", width: 300 },
  { field: "email", headerName: "Email", width: 300 },
  { field: "score", headerName: "Score", width: 100 },
  { field: "streak", headerName: "Streak", width: 100 },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function Table({ data }: { data: Users[] }) {
  return (
    <Paper sx={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{ border: 50 }}
      />
    </Paper>
  );
}
