import MacToolbar from '../components/global/MacToolbar';
import ViewDeck from '../components/ViewDeck';
import MobileDock from '../components/global/MobileDock';
import DesktopDock from '../components/global/DesktopDock';

interface AppLayoutProps {
  backgroundUrl: string;
}

export default function Desktop({ backgroundUrl }: AppLayoutProps) {
  return (
    <div className='relative w-screen h-screen overflow-hidden'>
      <div
        className='absolute inset-0 bg-cover bg-center'
        style={{ backgroundImage: `url(${backgroundUrl})` }}
      />

      <div className='relative z-10'>
        <MacToolbar onSettingsClick={() => {}} />
      </div>

      <ViewDeck />

      {/* Docks hidden for quadrant layout */}
      {/* <MobileDock /> */}
      {/* <DesktopDock /> */}
    </div>
  );
}
