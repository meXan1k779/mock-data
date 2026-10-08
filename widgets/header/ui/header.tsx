'use client';

import Link from 'next/link';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { resetEditorData } from '@/features/article/new-article/models/article-slice';
import { ARTICLE_EDITOR_LABELS } from '@/features/article/new-article/ui/constants';
import { logout } from '@/features/auth/models/auth-slice';
import { mockNotifications } from '@/features/notifications/model/mock-data';
import { NotificationsPanel } from '@/features/notifications/ui/notifications-panel';
import { UserMenuPanel } from '@/features/user-menu/ui/user-menu-panel';
import { useAppDispatch, type RootState } from '@/shared/api/store';
import { useClickOutside } from '@/shared/hooks/useClickOutside';
import { useMedia } from '@/shared/hooks/useMedia';
import { ChevronLeftIcon } from '@/shared/icons/chevronLeftIcon';
import { FinexLogoIcon } from '@/shared/icons/finexLogoIcon';
import { Avatar } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';

const Header = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  const { status } = useSelector((state: RootState) => state.articleSave);

  const [notifications, setNotifications] = useState(mockNotifications);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => n.isNew).length;

  const [isUserMenuOpenDesktop, setUserMenuOpenDesktop] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useClickOutside(notificationsRef, () => setNotificationsOpen(false), isNotificationsOpen);

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isNew: false })));
  };

  const user = useSelector((state: RootState) => state.auth.user);

  const params = useParams();
  const articleId = (params?.article || params?.id) as string;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isXlDesktop, isMobile } = useMedia();

  // On mobile the panel is a full-screen "modal" ("Panduan Finex" usability-test
  // requirement) — give it its own URL (?modal=profile-menu) so it's a distinct,
  // trackable screen and the hardware/browser back button closes it naturally.
  // Desktop keeps the old local-state dropdown: a history entry per hover-ish
  // dropdown open/close would be a confusing back-button trap there.
  const isUserMenuOpenMobile = searchParams.get('modal') === 'profile-menu';
  const isUserMenuOpen = isMobile ? isUserMenuOpenMobile : isUserMenuOpenDesktop;

  const closeUserMenu = () => {
    if (isMobile) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('modal');
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
      return;
    }
    setUserMenuOpenDesktop(false);
  };

  useClickOutside(userMenuRef, closeUserMenu, isUserMenuOpen);

  const isNewArticle = pathname.includes('new-article');
  const isEnterPage = pathname.includes('login') || pathname.includes('register');
  const isArticleGuidePage = pathname.includes('guide') && !isXlDesktop;
  const isArticleTopicsPage = pathname.includes('topics') && !isXlDesktop;
  const isPreviewPage = pathname.includes('preview');

  const isGuideOrTopicsPage = isArticleGuidePage || isArticleTopicsPage;

  const clearEditorData = () => {
    dispatch(resetEditorData());
  };

  const handleBackClick = () => {
    if (isArticleGuidePage) {
      router.replace('/');
      return;
    }
    if (isArticleTopicsPage) {
      router.replace('/new-article/guide');
      return;
    }
  };

  const handlePreviewClick = () => {
    router.replace(`/new-article/preview/${articleId}`);
  };

  const handleEditClick = () => {
    const route = isPreviewPage ? `/new-article/${articleId}` : `/new-article/topics/${articleId}`;
    router.replace(route);
  };

  const handleAvatarClick = () => {
    if (isUserMenuOpen) {
      closeUserMenu();
      return;
    }
    if (isMobile) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('modal', 'profile-menu');
      router.push(`${pathname}?${params.toString()}`);
      return;
    }
    setUserMenuOpenDesktop(true);
  };

  const handleUserMenuLogout = () => {
    closeUserMenu();
    dispatch(logout());
    router.push('/');
  };

  const articleHeader = (
    <div className="bg-background-primary m-auto flex justify-between items-center max-w-[732px] h-16 px-4 lg:px-6">
      <div className="flex items-center cursor-pointer" onClick={handleEditClick}>
        <ChevronLeftIcon className="mr-2" />
        {!isMobile && <span className="text-sm">{isPreviewPage ? 'Ubah' : 'Topik'}</span>}
      </div>
      <div className="text-content-secondary">
        {isPreviewPage
          ? ARTICLE_EDITOR_LABELS.preview
          : status === 'saving'
            ? ARTICLE_EDITOR_LABELS.saving
            : ARTICLE_EDITOR_LABELS.savedToDraft}
      </div>

      <div className="cursor-pointer text-sm" onClick={handlePreviewClick}>
        {isPreviewPage ? '' : ARTICLE_EDITOR_LABELS.preview}
      </div>
    </div>
  );

  const guideHeader = (
    <div className="bg-background-primary m-auto flex justify-between items-center max-w-[732px] h-16 px-4 lg:px-6">
      <div className="flex items-center cursor-pointer" onClick={handleBackClick}>
        <ChevronLeftIcon className="mr-2" />
        <span className="text-sm">Kembali</span>
      </div>
    </div>
  );

  const baseHeaderContent = (
    <div className="container px-4 sm:px-8 lg:px-10 py-4 sm:py-4.5 max-w-7xl m-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <FinexLogoIcon onClick={clearEditorData} className="w-[93px] h-7 sm:w-fit sm:h-fit" />
          </Link>
        </div>
        {isPreviewPage && (
          <div className="text-content-primary">{ARTICLE_EDITOR_LABELS.preview}</div>
        )}
        <div className="flex items-center gap-2">
          {!isLoading &&
            !isEnterPage &&
            (isAuthenticated ? (
              <div className="flex items-center gap-2">
                {!isNewArticle && (
                  <Button
                    size="sm"
                    variant="text"
                    onClick={() => {
                      clearEditorData();
                      router.push('/new-article/guide');
                    }}
                    leftIcon={<img src="/notifications/plus.svg" alt="" className="size-4" />}
                  >
                    Buat artikel
                  </Button>
                )}
                <div className="relative hidden" ref={notificationsRef}>
                  <button
                    onClick={() => setNotificationsOpen((prev) => !prev)}
                    aria-label="Notifications"
                    className="bg-secondary-default flex items-center justify-center p-2 rounded-full relative"
                  >
                    <img src="/notifications/bell.svg" alt="" className="size-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-1 bg-base-positive border-2 border-background-primary text-white text-[10px] font-bold size-4 rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {isNotificationsOpen && (
                    <>
                      <div
                        className="fixed inset-0 md:top-[68px] bg-[rgba(17,25,40,0.2)] z-10"
                        onClick={() => setNotificationsOpen(false)}
                      />
                      <NotificationsPanel
                        className="fixed z-30 inset-4 md:inset-auto md:top-[88px] md:bottom-5 md:w-[380px] md:right-[max(2rem,calc((100vw_-_1280px)/2_+_2rem))] lg:right-[max(2.5rem,calc((100vw_-_1280px)/2_+_2.5rem))]"
                        notifications={notifications}
                        unreadCount={unreadCount}
                        onClose={() => setNotificationsOpen(false)}
                        onMarkAllAsRead={handleMarkAllAsRead}
                      />
                    </>
                  )}
                </div>
                <div className="relative" ref={userMenuRef}>
                  <Avatar
                    size="md"
                    className="cursor-pointer"
                    nickname={user?.nickname}
                    avatarUrl={user?.avatarUrl}
                    onClick={handleAvatarClick}
                  />
                  {isUserMenuOpen && (
                    <UserMenuPanel
                      className="fixed z-30 inset-0 md:inset-auto md:top-[76px] md:w-[326px] md:right-[max(1rem,calc((100vw_-_1280px)/2_+_1rem))] lg:right-[max(2.5rem,calc((100vw_-_1280px)/2_+_2.5rem))]"
                      isMobile={isMobile}
                      nickname={user?.nickname}
                      email={user?.email}
                      avatarUrl={user?.avatarUrl}
                      onNavigate={closeUserMenu}
                      onLogout={handleUserMenuLogout}
                      onClose={closeUserMenu}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <Button
                  variant="secondary"
                  size="sm"
                  className="mr-3"
                  onClick={() => router.push('/login')}
                >
                  Masuk
                </Button>
                <Button onClick={() => router.push('/register')} size="sm">
                  Daftar
                </Button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const header = (() => {
    switch (true) {
      case !(isNewArticle && !isXlDesktop):
        return baseHeaderContent;
      case isGuideOrTopicsPage:
        return guideHeader;
      default:
        return articleHeader;
    }
  })();

  return (
    <header className="bg-white fixed top-0 right-0 left-0 z-20">
      <div className="border-b border-border-tetriary">{header}</div>
    </header>
  );
};

export default Header;
