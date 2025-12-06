
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';

// Books
import AtomicHabits from './books/atomic-habits.mdx';
import DeepWork from './books/deep-work.mdx';
import DailyStoic from './books/daily-stoic.mdx';
import DopamineDetox from './books/dopamine-detox.mdx';

// Guides
import UnifiedStudyGuide from './guides/unified-study-guide.mdx';
import StudyGuide1 from './guides/study-guide-1.mdx';
import StudyGuide2 from './guides/study-guide-2.mdx';

// Protocols
import LifeProtocol from './protocols/life-protocol.mdx';

const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className="content-wrapper">
            {children}
        </div>
    );
};

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<ContentWrapper><Home /></ContentWrapper>} />
                    <Route path="/index" element={<ContentWrapper><Home /></ContentWrapper>} />

                    {/* Books */}
                    <Route path="/books/atomic-habits" element={<ContentWrapper><AtomicHabits /></ContentWrapper>} />
                    <Route path="/atomic-habits" element={<ContentWrapper><AtomicHabits /></ContentWrapper>} />

                    <Route path="/books/deep-work" element={<ContentWrapper><DeepWork /></ContentWrapper>} />
                    <Route path="/deep-work" element={<ContentWrapper><DeepWork /></ContentWrapper>} />

                    <Route path="/books/daily-stoic" element={<ContentWrapper><DailyStoic /></ContentWrapper>} />
                    <Route path="/daily-stoic" element={<ContentWrapper><DailyStoic /></ContentWrapper>} />

                    <Route path="/books/dopamine-detox" element={<ContentWrapper><DopamineDetox /></ContentWrapper>} />
                    <Route path="/dopamine-detox" element={<ContentWrapper><DopamineDetox /></ContentWrapper>} />

                    {/* Guides */}
                    <Route path="/guides/unified-study-guide" element={<ContentWrapper><UnifiedStudyGuide /></ContentWrapper>} />
                    <Route path="/guides/study-guide-1" element={<ContentWrapper><StudyGuide1 /></ContentWrapper>} />
                    <Route path="/guides/study-guide-2" element={<ContentWrapper><StudyGuide2 /></ContentWrapper>} />

                    {/* Protocols */}
                    <Route path="/protocols/life-protocol" element={<ContentWrapper><LifeProtocol /></ContentWrapper>} />

                    {/* Fallback for .html extensions from legacy links */}
                    <Route path="/books/atomic-habits.html" element={<ContentWrapper><AtomicHabits /></ContentWrapper>} />
                    <Route path="/books/deep-work.html" element={<ContentWrapper><DeepWork /></ContentWrapper>} />
                    <Route path="/books/daily-stoic.html" element={<ContentWrapper><DailyStoic /></ContentWrapper>} />
                    <Route path="/books/dopamine-detox.html" element={<ContentWrapper><DopamineDetox /></ContentWrapper>} />
                    <Route path="/guides/unified-study-guide.html" element={<ContentWrapper><UnifiedStudyGuide /></ContentWrapper>} />
                    <Route path="/protocols/life-protocol.html" element={<ContentWrapper><LifeProtocol /></ContentWrapper>} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
