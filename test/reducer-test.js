import reducer from '../react/reducers/workbooks';

describe("workbooks reducer", () => {
  it("initializes default state", () => {
    const initialState = reducer();
    expect(initialState.currentSite.urlName).to.equal('');
    expect(initialState.currentSite.name).to.equal('');
    expect(initialState.currentUser.displayName).to.equal('');
    expect(initialState.sites).to.deep.equal([]);
    expect(initialState.workbookIds).to.deep.equal([]);
    expect(initialState.workbooksById).to.deep.equal({});
    expect(initialState.hasMore).to.equal(true);
    expect(initialState.loadMore).to.be.an.instanceof(Function);
    expect(initialState.loadingMore).to.equal(false);
  });


  it("handles SET_CURRENT_SITE", () => {
    const initialState = reducer();
    const currentSite = 'foo';
    const action = { type: 'SET_CURRENT_SITE', currentSite }
    const nextState = reducer(initialState, action);
    expect(nextState.currentSite).to.deep.equal(currentSite);
  });

  it("handles SET_CURRENT_USER", () => {
    const initialState = reducer();
    const currentUser = 'foo';
    const action = { type: 'SET_CURRENT_USER', currentUser }
    const nextState = reducer(initialState, action);
    expect(nextState.currentUser).to.deep.equal(currentUser);
  });

  it("handles SET_SITES", () => {
    const initialState = reducer();
    const sites = 'foo';
    const action = { type: 'SET_SITES', sites }
    const nextState = reducer(initialState, action);
    expect(nextState.sites).to.deep.equal(sites);
  });

  it("handles BUSY_LOADING_MORE", () => {
    const initialState = reducer();
    const action = { type: 'BUSY_LOADING_MORE' }
    const nextState = reducer(initialState, action);
    expect(nextState.loadingMore).to.equal(true);
  });
});
