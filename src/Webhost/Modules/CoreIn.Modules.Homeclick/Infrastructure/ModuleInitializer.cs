using System.Collections.Generic;
using Microsoft.Extensions.DependencyInjection;
using CoreIn.Modular.Infrastructure;
using CoreIn.Commons;
using CoreIn.Models;
using CoreIn.Models.Authentication;
using CoreIn.Resources.ConstantKeys;
using Microsoft.AspNetCore.Identity;
using CoreIn.EntityCore;

namespace CoreIn.Modules.Homeclick
{
    public class ModularInitializer : IModuleInitializer
    {
        private void InitDatabase(UserManager<User> userManager, IMenuHelper menuHelper)
        {
            var supperUser = userManager.FindByNameAsync(AppKey.SupperAdminUserName).Result;
            var appMenu = menuHelper.Menu(AppKey.AppMenuName);

            menuHelper.CreateMenuEntity(
                new Menu {
                    Name = "homeclick",
                    Parent = appMenu,
                    Children = new List<Menu>
                    {
                        menuHelper.CreateMenuEntity(
                            new Menu {
                                Name = "project",
                                Children = new List<Menu>
                                {
                                     menuHelper.CreateMenuEntity(
                                        new Menu
                                        {
                                            Name = "project-index",
                                        },
                                        new MenuDetail[]
                                        {
                                            new MenuDetail { Field = "title", Value = "All projects", Language="en-US"},
                                            new MenuDetail { Field = "title", Value = "Tất cả dự Án", Language="vi-VN"},
                                            new MenuDetail { Field = "controller", Value = "project"},
                                            new MenuDetail { Field = "action", Value = "index"},
                                            new MenuDetail { Field = "url", Value = "/project"},
                                            new MenuDetail { Field = "icon", Value = "<i class=\"fa fa-bars\" aria-hidden=\"true\"></i>"},
                                        },
                                        supperUser, false
                                    ),
                                    menuHelper.CreateMenuEntity(
                                        new Menu
                                        {
                                            Name = "project-new",
                                        },
                                        new MenuDetail[]
                                        {
                                            new MenuDetail { Field = "title", Value = "New project", Language="en-US"},
                                            new MenuDetail { Field = "title", Value = "Thêm dự án mới", Language="vi-VN"},
                                            new MenuDetail { Field = "controller", Value = "project"},
                                            new MenuDetail { Field = "action", Value = "create"},
                                            new MenuDetail { Field = "url", Value = "/project/create"},
                                            new MenuDetail { Field = "icon", Value = "<i class=\"fa fa-plus\" aria-hidden=\"true\"></i>"},
                                        },
                                        supperUser, false
                                    )
                                }
                            },
                            new MenuDetail[]
                            {
                                new MenuDetail { Field = "title", Value = "Project", Language="en-US"},
                                new MenuDetail { Field = "title", Value = "Dự Án", Language="vi-VN"},
                                new MenuDetail { Field = "url", Value = "#"},
                                new MenuDetail { Field = "icon", Value = "<i class=\"fa fa-building-o\" aria-hidden=\"true\"></i>"},
                            },
                            supperUser, false
                            ),
                        menuHelper.CreateMenuEntity(
                            new Menu {
                                Name = "collections",
                                Children = new List<Menu>
                                {
                                     menuHelper.CreateMenuEntity(
                                        new Menu
                                        {
                                            Name = "collection-index",
                                        },
                                        new MenuDetail[]
                                        {
                                            new MenuDetail { Field = "title", Value = "All collection", Language="en-US"},
                                            new MenuDetail { Field = "title", Value = "Tất cả bộ sưu tập", Language="vi-VN"},
                                            new MenuDetail { Field = "controller", Value = "collection"},
                                            new MenuDetail { Field = "action", Value = "index"},
                                            new MenuDetail { Field = "url", Value = "/collection"},
                                            new MenuDetail { Field = "icon", Value = "<i class=\"fa fa-bars\" aria-hidden=\"true\"></i>"},
                                        },
                                        supperUser, false
                                    ),
                                    menuHelper.CreateMenuEntity(
                                        new Menu
                                        {
                                            Name = "collection-new",
                                        },
                                        new MenuDetail[]
                                        {
                                            new MenuDetail { Field = "title", Value = "New collection", Language="en-US"},
                                            new MenuDetail { Field = "title", Value = "Tạo bộ sưu tập", Language="vi-VN"},
                                            new MenuDetail { Field = "controller", Value = "collection"},
                                            new MenuDetail { Field = "action", Value = "create"},
                                            new MenuDetail { Field = "url", Value = "/collection/create"},
                                            new MenuDetail { Field = "icon", Value = "<i class=\"fa fa-plus\" aria-hidden=\"true\"></i>"},
                                        },
                                        supperUser, false
                                    )
                                }
                            },
                            new MenuDetail[]
                            {
                                new MenuDetail { Field = "title", Value = "Collections", Language="en-US"},
                                new MenuDetail { Field = "title", Value = "Bộ sưu tập", Language="vi-VN"},
                                new MenuDetail { Field = "url", Value = "#"},
                                new MenuDetail { Field = "icon", Value = "<i class=\"fa fa-suitcase\" aria-hidden=\"true\"></i>"},
                            },
                            supperUser, false
                            ),
                        menuHelper.CreateMenuEntity(
                            new Menu {
                                Name = "posts",
                                Children = new List<Menu>
                                {
                                     menuHelper.CreateMenuEntity(
                                        new Menu
                                        {
                                            Name = "post-index",
                                        },
                                        new MenuDetail[]
                                        {
                                            new MenuDetail { Field = "title", Value = "All post", Language="en-US"},
                                            new MenuDetail { Field = "title", Value = "Tất cả bài viết", Language="vi-VN"},
                                            new MenuDetail { Field = "controller", Value = "post"},
                                            new MenuDetail { Field = "action", Value = "index"},
                                            new MenuDetail { Field = "url", Value = "/post"},
                                            new MenuDetail { Field = "icon", Value = "<i class=\"fa fa-bars\" aria-hidden=\"true\"></i>"},
                                        },
                                        supperUser, false
                                    ),
                                    menuHelper.CreateMenuEntity(
                                        new Menu
                                        {
                                            Name = "post-new",
                                        },
                                        new MenuDetail[]
                                        {
                                            new MenuDetail { Field = "title", Value = "New post", Language="en-US"},
                                            new MenuDetail { Field = "title", Value = "Bài viết mới", Language="vi-VN"},
                                            new MenuDetail { Field = "controller", Value = "post"},
                                            new MenuDetail { Field = "action", Value = "create"},
                                            new MenuDetail { Field = "url", Value = "/post/create"},
                                            new MenuDetail { Field = "icon", Value = "<i class=\"fa fa-plus\" aria-hidden=\"true\"></i>"},
                                        },
                                        supperUser, false
                                    )
                                }
                            },
                            new MenuDetail[]
                            {
                                new MenuDetail { Field = "title", Value = "Post", Language="en-US"},
                                new MenuDetail { Field = "title", Value = "Bài viết", Language="vi-VN"},
                                new MenuDetail { Field = "url", Value = "#"},
                                new MenuDetail { Field = "icon", Value = "<i class=\"fa fa-sticky-note\" aria-hidden=\"true\"></i>"},
                            },
                            supperUser, false
                            ),
                        menuHelper.CreateMenuEntity(
                            new Menu {
                                Name = "options",
                                Children = new List<Menu>
                                {
                                     menuHelper.CreateMenuEntity(
                                        new Menu
                                        {
                                            Name = "options-index",
                                        },
                                        new MenuDetail[]
                                        {
                                            new MenuDetail { Field = "title", Value = "All option", Language="en-US"},
                                            new MenuDetail { Field = "title", Value = "Tất cả Tùy chỉnh", Language="vi-VN"},
                                            new MenuDetail { Field = "controller", Value = "optiongroup"},
                                            new MenuDetail { Field = "action", Value = "index"},
                                            new MenuDetail { Field = "url", Value = "/optiongroup"},
                                            new MenuDetail { Field = "icon", Value = "<i class=\"fa fa-bars\" aria-hidden=\"true\"></i>"},
                                        },
                                        supperUser, false
                                    ),
                                    menuHelper.CreateMenuEntity(
                                        new Menu
                                        {
                                            Name = "options-new",
                                        },
                                        new MenuDetail[]
                                        {
                                            new MenuDetail { Field = "title", Value = "New option group", Language="en-US"},
                                            new MenuDetail { Field = "title", Value = "Tạo nhóm tùy chỉnh", Language="vi-VN"},
                                            new MenuDetail { Field = "controller", Value = "optiongroup"},
                                            new MenuDetail { Field = "action", Value = "create"},
                                            new MenuDetail { Field = "url", Value = "/optiongroup/create"},
                                            new MenuDetail { Field = "icon", Value = "<i class=\"fa fa-plus\" aria-hidden=\"true\"></i>"},
                                        },
                                        supperUser, false
                                    )
                                }
                            },
                            new MenuDetail[]
                            {
                                new MenuDetail { Field = "title", Value = "Options", Language="en-US"},
                                new MenuDetail { Field = "title", Value = "Tùy chỉnh", Language="vi-VN"},
                                new MenuDetail { Field = "url", Value = "#"},
                                new MenuDetail { Field = "icon", Value = "<i class=\"fa fa-cog\" aria-hidden=\"true\"></i>"},
                            },
                            supperUser, false
                            ),
                    }
                },
                new MenuDetail[]
                {
                    new MenuDetail { Field = "title", Value = "Homeclick"}
                }, supperUser
                );
        }

        public void Init(IServiceCollection services)
        {
            var serviceProvider = services.BuildServiceProvider();

            var userManager = serviceProvider.GetService<UserManager<User>>();
            var menuHelper = serviceProvider.GetService<IMenuHelper>();
            var taxonomyHelper = serviceProvider.GetService<ITaxonomyHelper>();

            services.AddSingleton(new EntityTypeManager(serviceProvider.GetService<IEntityTypeManager>(), userManager));

            var entityTypeManager = services.BuildServiceProvider().GetService<EntityTypeManager>();

            services.AddSingleton(new TaxonomyTypeManager(entityTypeManager, taxonomyHelper, userManager));

            services.AddSingleton(typeof(ProjectManager));
            services.AddSingleton(typeof(PostManager));
            services.AddSingleton(typeof(CollectionManager));
            services.AddSingleton(typeof(OptionGroupManager));

            InitDatabase(userManager, menuHelper);
        }
    }
}
