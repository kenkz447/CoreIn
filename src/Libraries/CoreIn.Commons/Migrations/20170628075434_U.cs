using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CoreIn.Commons.Migrations
{
    public partial class U : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CoreIn_PostComment_CoreIn_PostEntity_PostId",
                table: "CoreIn_PostComment");

            migrationBuilder.RenameColumn(
                name: "PostId",
                table: "CoreIn_PostComment",
                newName: "EntityId");

            migrationBuilder.RenameIndex(
                name: "IX_CoreIn_PostComment_PostId",
                table: "CoreIn_PostComment",
                newName: "IX_CoreIn_PostComment_EntityId");

            migrationBuilder.AddForeignKey(
                name: "FK_CoreIn_PostComment_CoreIn_PostEntity_EntityId",
                table: "CoreIn_PostComment",
                column: "EntityId",
                principalTable: "CoreIn_PostEntity",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CoreIn_PostComment_CoreIn_PostEntity_EntityId",
                table: "CoreIn_PostComment");

            migrationBuilder.RenameColumn(
                name: "EntityId",
                table: "CoreIn_PostComment",
                newName: "PostId");

            migrationBuilder.RenameIndex(
                name: "IX_CoreIn_PostComment_EntityId",
                table: "CoreIn_PostComment",
                newName: "IX_CoreIn_PostComment_PostId");

            migrationBuilder.AddForeignKey(
                name: "FK_CoreIn_PostComment_CoreIn_PostEntity_PostId",
                table: "CoreIn_PostComment",
                column: "PostId",
                principalTable: "CoreIn_PostEntity",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
