import React from 'react';
import { Image, Grid } from 'semantic-ui-react';
import LandingNavBar from '../components/LandingNavBar';
import Footer from '../components/Footer';
import PublicMap from '../components/PublicMap';

class PublicCommunity extends React.Component {

  render() {
    return (
      <div>
        <LandingNavBar/>
        <div id='public-community-container'>
          <div id='community-map'>
            <PublicMap/>
          </div>
          <div id='public-community-bottom'>
            <div id='community-engagement'>
              <h1 id='community-engagement-header' align='center'>Get involved with the community</h1>
              <p id='community-engagement-paragraph'>
                We believe that Hawaii is home for everybody! This includes the flora and fauna.
                Work with neighbors, coworkers, family, and help support the community to make Hawaii a better place.
                There are a lot of welcoming organizations around the state helping the initiative to keep Hawaii green.
                We invite you to interact with the map, learn more about the organizations near your area, and contribute to a better Hawaii.
                Let&apos;s all find a way to make an environmental impact in a positive way!
              </p>
            </div>
            <Grid>
              <Grid.Column width={4}>
                <Image size='medium' src="/organizations/sustainable-coastlines.png"/>
                <div className='organizations'>
                  <a rel='noreferrer' className='organization-name' href='https://www.sustainablecoastlineshawaii.org/' target='_blank'>Sustainable Coastlines Hawaii</a>
                </div>
                <p>
                  Conserving Hawaii&apos;s lands and waters by hosting beach cleanups.
                    Educating our communities to sustain better green lifestyles.
                </p>
              </Grid.Column>
              <Grid.Column width={4}>
                <Image size='medium' src="/organizations/hawaii-conservation-alliance.png"/>
                <div className='organizations'>
                  <a rel='noreferrer' className='organization-name' href='https://www.hawaiiconservation.org/' target='_blank'>Hawaii Conservation Alliance</a>
                </div>
                <p>
                  Combines science and hardwork to perserve Hawaii&apos;s ecosystems.
                    Continuous research lifts our knowledge to allow the state to thrive.
                </p>
              </Grid.Column>
              <Grid.Column width={4}>
                <Image size='medium' src="/organizations/808cleanups.png"/>
                <div className='organizations'>
                  <a rel='noreferrer' className='organization-name' href='https://808cleanups.org/' target='_blank'>808 Cleanups</a>
                </div>
                <p>
                    Engaging the community to work together to clean up the islands.
                    Building a greener future for Hawaii&apos;s youth.
                </p>
              </Grid.Column>
              <Grid.Column width={4}>
                <Image size='medium' src="/organizations/hawaii-wildlife-fund.png"/>
                <div className='organizations'>
                  <a rel='noreferrer' className='organization-name' href='https://www.wildhawaii.org/' target='_blank'>Hawaii Wildlife Fund</a>
                </div>
                <p>
                    Saving hawaii&apos;s coastal wildlife by advocacy, research, and community engagement.
                    Teaching Hawaii&apos;s next generation green practices.
                </p>
              </Grid.Column>
            </Grid>
            <Grid>
              <Grid.Column width={4}>
                <Image size='medium' src="/organizations/sierra-club.png"/>
                <div className='organizations'>
                  <a rel='noreferrer' className='organization-name' href='https://sierraclubhig.org/' target='_blank'>Sierra Club Hawaii</a>
                </div>
                <p>
                    Hawaii&apos;s local branch of a nation wide initiative to preserve our planet.
                    One of the oldest organizations keeping Hawaii green.
                </p>
              </Grid.Column>
              <Grid.Column width={4}>
                <Image size='medium' src="/organizations/marine-resource-council.png"/>
                <div className='organizations'>
                  <a rel='noreferrer' className='organization-name' href='https://www.mauireefs.org/' target='_blank'>Marine Resource Council</a>
                </div>
                <p>
                    Preserving our waters and reefs to be crystal clear and full of live.
                    Keeping maui clean and the community safe by research.
                </p>
              </Grid.Column>
              <Grid.Column width={4}>
                <Image size='medium' src="/organizations/waiwai-ola.png"/>
                <div className='organizations'>
                  <a rel='noreferrer' className='organization-name' href='https://waterkeepershi.org/' target='_blank'>Waiwai Ola Waterkeepers Hawaii</a>
                </div>
                <p>
                    Cleansing the water quality statewide through determination and beautification.
                    Saving native oysters and marine wildlife.
                </p>
              </Grid.Column>
              <Grid.Column width={4}>
                <Image size='medium' src="/organizations/kokee-resource.png"/>
                <div className='organizations'>
                  <a rel='noreferrer' className='organization-name' href='https://www.krcp.org/' target='_blank'>Kōkeʻe Resource Conservation Program</a>
                </div>
                <p>
                    Saving Kauai&apos;s native plants by safely removing invasive plant species.
                    Promoting the forest&apos;s biodiversity in an engaging manner.
                </p>
              </Grid.Column>
            </Grid>
            <Grid>
              <Grid.Column width={4}>
                <Image size='medium' src="/organizations/kisc.png"/>
                <div className='organizations'>
                  <a rel='noreferrer' className='organization-name' href='https://www.kauaiisc.org/' target='_blank'>Kauaʻi Invasive Species Committee</a>
                </div>
                <p>
                    Saving Kauai&apos;s plant and animal species from facing extinction.
                    Working with lawmakers to remove invasive species harming the biodiversity.
                </p>
              </Grid.Column>
              <Grid.Column width={4}>
                <Image size='medium' src="/organizations/ka-honua-momona.png"/>
                <div className='organizations'>
                  <a rel='noreferrer' className='organization-name' href='https://kahonuamomona.org/' target='_blank'>Ka Honua Momona</a>
                </div>
                <p>
                    Based in Molokai, promoting sustainability through old practices.
                    Educating and fostering community engagement to preserve Hawaii&apos;s cultural heritage.
                </p>
              </Grid.Column>
              <Grid.Column width={4}>
                <Image size='medium' src="/organizations/lanai-culture.png"/>
                <div className='organizations'>
                  <a rel='noreferrer' className='organization-name' href='https://lanaichc.org/' target='_blank'>Lāna‘i Culture & Heritage Center</a>
                </div>
                <p>
                    Promoting community engagement by spreading cultural awareness.
                    Teaching safe land practices and cultural literacy for the Lanai&apos;s community.
                </p>
              </Grid.Column>
              <Grid.Column width={4}>
                <Image size='medium' src="/organizations/ke-ao-halii.png"/>
                <div className='organizations'>
                  <a rel='noreferrer' className='organization-name' href='https://savehanacoast.org/' target='_blank'>Ke Ao Hali‘i</a>
                </div>
                <p>
                    Maintaining Hāna Hawaii land to conserving cultural heritage and the environment.
                    Educating the community by teaching responsible coastal usage and practices.
                </p>
              </Grid.Column>
            </Grid>
          </div>
        </div>
        <Footer id={'community-footer'}/>
      </div>
    );
  }
}

export default PublicCommunity;
