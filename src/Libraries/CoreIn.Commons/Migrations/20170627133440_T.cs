using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace CoreIn.Commons.Migrations
{
    public partial class T : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "CoreIn_PostEntity",
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.AddUniqueConstraint(
                name: "AK_CoreIn_PostEntity_Name",
                table: "CoreIn_PostEntity",
                column: "Name");

            migrationBuilder.CreateTable(
                name: "CoreIn_PostComment",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Author = table.Column<string>(nullable: false),
                    Content = table.Column<string>(nullable: false),
                    Email = table.Column<string>(nullable: true),
                    PostId = table.Column<long>(nullable: false),
                    ReplyToCommentId = table.Column<long>(nullable: true),
                    Time = table.Column<DateTime>(nullable: false),
                    Url = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoreIn_PostComment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoreIn_PostComment_CoreIn_PostEntity_PostId",
                        column: x => x.PostId,
                        principalTable: "CoreIn_PostEntity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CoreIn_PostComment_CoreIn_PostComment_ReplyToCommentId",
                        column: x => x.ReplyToCommentId,
                        principalTable: "CoreIn_PostComment",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_PostComment_PostId",
                table: "CoreIn_PostComment",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_PostComment_ReplyToCommentId",
                table: "CoreIn_PostComment",
                column: "ReplyToCommentId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CoreIn_PostComment");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_CoreIn_PostEntity_Name",
                table: "CoreIn_PostEntity");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "CoreIn_PostEntity",
                nullable: false,
                oldClrType: typeof(string));
        }
    }
}
