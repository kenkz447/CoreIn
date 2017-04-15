using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CoreIn.Commons.Migrations
{
    public partial class A : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CoreIn_Menu_CoreIn_Menu_MenuId",
                table: "CoreIn_Menu");

            migrationBuilder.RenameColumn(
                name: "MenuId",
                table: "CoreIn_Menu",
                newName: "ParentId");

            migrationBuilder.RenameIndex(
                name: "IX_CoreIn_Menu_MenuId",
                table: "CoreIn_Menu",
                newName: "IX_CoreIn_Menu_ParentId");

            migrationBuilder.AddForeignKey(
                name: "FK_CoreIn_Menu_CoreIn_Menu_ParentId",
                table: "CoreIn_Menu",
                column: "ParentId",
                principalTable: "CoreIn_Menu",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CoreIn_Menu_CoreIn_Menu_ParentId",
                table: "CoreIn_Menu");

            migrationBuilder.RenameColumn(
                name: "ParentId",
                table: "CoreIn_Menu",
                newName: "MenuId");

            migrationBuilder.RenameIndex(
                name: "IX_CoreIn_Menu_ParentId",
                table: "CoreIn_Menu",
                newName: "IX_CoreIn_Menu_MenuId");

            migrationBuilder.AddForeignKey(
                name: "FK_CoreIn_Menu_CoreIn_Menu_MenuId",
                table: "CoreIn_Menu",
                column: "MenuId",
                principalTable: "CoreIn_Menu",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
